import * as React from 'react';
import {
  HorizontalNav,
  K8sResourceCommon,
  NavPage,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import classnames from 'classnames';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Popover,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { K8sResourceKind } from '../../types';
import { referenceForModel } from '../../utils';
import { ErrorPage } from '../error/Errors';
import { LinkifyExternal } from '../generics/link';
import { ResourceIcon } from '../generics/resource-link';
import { LoadingBox } from '../generics/status-box';
import { getPropertyDescription } from '../generics/swagger';
import PageHeading from '../heading/page-heading';
import { LaunchModal, ModalKeys } from '../modals/modalLauncher';
import { getName } from '../selectors/k8s';
import { LabelList } from './label-list';
import { OwnerReferences } from './owner-references';
import { Timestamp } from './timestamp';
import './details.scss';

type DetailsPageProps = {
  pages: NavPage[];
  actions?: any;
  resource: K8sResourceCommon;
  resourceModel: K8sModel;
  breadcrumbs?: { name: string; path: string }[];
  loaded?: boolean;
  loadError?: any;
};

type DetailsPageTitleProps = {
  resource: K8sResourceCommon;
  resourceModel: K8sModel;
};

const DetailsPageTitle: React.FC<DetailsPageTitleProps> = ({
  resource,
  resourceModel,
}) => (
  <span>
    <ResourceIcon resourceModel={resourceModel} />
    {getName(resource)}
  </span>
);

const DetailsPage: React.FC<DetailsPageProps> = ({
  pages,
  resource,
  actions,
  breadcrumbs,
  resourceModel,
  loaded = true,
  loadError = null,
}) => (
  <>
    {!loaded && <LoadingBox />}
    {loaded && loadError && <ErrorPage message={loadError?.message} />}
    {loaded && !loadError && (
      <>
        <PageHeading
          breadcrumbs={breadcrumbs}
          title={
            <DetailsPageTitle
              resource={resource}
              resourceModel={resourceModel}
            />
          }
          actions={actions}
          resource={resource}
          className="odf-resource-details"
        />
        <HorizontalNav pages={pages} resource={resource} />{' '}
      </>
    )}
  </>
);

export default DetailsPage;

export type ResourceSummaryProps = {
  resource: K8sResourceKind;
  showPodSelector?: boolean;
  showNodeSelector?: boolean;
  showAnnotations?: boolean;
  showTolerations?: boolean;
  showLabelEditor?: boolean;
  canUpdateResource?: boolean;
  podSelector?: string;
  nodeSelector?: string;
  children?: React.ReactNode;
  customPathName?: string;
  launchModal: LaunchModal;
  resourceModel: K8sModel;
};

export type DetailsItemProps = {
  canEdit?: boolean;
  defaultValue?: React.ReactNode;
  description?: string;
  editAsGroup?: boolean;
  hideEmpty?: boolean;
  label: string;
  labelClassName?: string;
  obj: K8sResourceKind;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path?: string | string[];
  valueClassName?: string;
  model?: K8sModel;
};

export const PropertyPath: React.FC<{ kind: string; path: string | string[] }> =
  ({ kind, path }) => {
    const pathArray: string[] = _.toPath(path);
    return (
      <Breadcrumb className="pf-c-breadcrumb--no-padding-top">
        <BreadcrumbItem>{kind}</BreadcrumbItem>
        {pathArray.map((property, i) => {
          const isLast = i === pathArray.length - 1;
          return (
            <BreadcrumbItem key={i} isActive={isLast}>
              {property}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    );
  };

type EditButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
};

const EditButton: React.FC<EditButtonProps> = (props) => {
  return (
    <Button
      type="button"
      variant="link"
      isInline
      onClick={props.onClick}
      data-test={
        props.testId
          ? `${props.testId}-details-item__edit-button`
          : 'details-item__edit-button'
      }
    >
      {props.children}
      <PencilAltIcon className="co-icon-space-l pf-c-button-icon--plain" />
    </Button>
  );
};

export type SwaggerDefinitions = {
  [name: string]: SwaggerDefinition;
};

export type SwaggerDefinition = {
  definitions?: SwaggerDefinitions;
  description?: string;
  type?: string;
  enum?: string[];
  $ref?: string;
  items?: SwaggerDefinition;
  required?: string[];
  properties?: {
    [prop: string]: SwaggerDefinition;
  };
};
export const DetailsItem: React.FC<DetailsItemProps> = ({
  children,
  defaultValue = '-',
  description,
  editAsGroup,
  hideEmpty,
  label,
  labelClassName,
  obj,
  onEdit,
  canEdit = true,
  path,
  valueClassName,
  model,
}) => {
  const { t } = useTranslation();
  const hide = hideEmpty && _.isEmpty(_.get(obj, path));
  const popoverContent: string =
    description ?? getPropertyDescription(model, path);
  const value: React.ReactNode = children || _.get(obj, path, defaultValue);
  const editable = onEdit && canEdit;
  return hide ? null : (
    <>
      <dt
        className={classnames('details-item__label', labelClassName)}
        data-test-selector={`details-item-label__${label}`}
      >
        <Split>
          <SplitItem className="details-item__label">
            {popoverContent || path ? (
              <Popover
                headerContent={<div>{label}</div>}
                {...(popoverContent && {
                  bodyContent: (
                    <LinkifyExternal>
                      <div className="co-pre-line">{popoverContent}</div>
                    </LinkifyExternal>
                  ),
                })}
                {...(path && {
                  footerContent: (
                    <PropertyPath kind={model?.kind} path={path} />
                  ),
                })}
                maxWidth="30rem"
              >
                <Button
                  data-test={label}
                  variant="plain"
                  className="details-item__popover-button"
                >
                  {label}
                </Button>
              </Popover>
            ) : (
              label
            )}
          </SplitItem>
          {editable && editAsGroup && (
            <>
              <SplitItem isFilled />
              <SplitItem>
                <EditButton testId={label} onClick={onEdit}>
                  {t('Edit')}
                </EditButton>
              </SplitItem>
            </>
          )}
        </Split>
      </dt>
      <dd
        className={classnames('details-item__value', valueClassName, {
          'details-item__value--group': editable && editAsGroup,
        })}
        data-test-selector={`details-item-value__${label}`}
      >
        {editable && !editAsGroup ? (
          <EditButton testId={label} onClick={onEdit}>
            {value}
          </EditButton>
        ) : (
          value
        )}
      </dd>
    </>
  );
};

export const ResourceSummary: React.FC<ResourceSummaryProps> = ({
  children,
  resource,
  customPathName,
  showPodSelector = false,
  showNodeSelector = false,
  showAnnotations = true,
  showTolerations = false,
  showLabelEditor = true,
  canUpdateResource = true,
  podSelector = 'spec.selector',
  nodeSelector = 'spec.template.spec.nodeSelector',
  launchModal,
  resourceModel,
}) => {
  const { t } = useTranslation();
  const { metadata } = resource;
  const reference = referenceForModel(resourceModel);
  const canUpdateAccess = true;
  // ToDo(Sanjal): Add custom useAccessReview here
  /*const [canUpdateAccess] = useAccessReview({
    group: resourceModel.apiGroup,
    resource: resourceModel.plural,
    verb: 'patch',
    name: metadata.name,
    namespace: metadata.namespace,
  });*/
  const canUpdate = canUpdateAccess && canUpdateResource;

  return (
    <dl data-test-id="resource-summary" className="co-m-pane__details">
      <DetailsItem
        label={t('Name')}
        obj={resource}
        path={customPathName || 'metadata.name'}
      />
      {metadata.namespace && (
        <DetailsItem
          label={t('Namespace')}
          obj={resource}
          path="metadata.namespace"
        >
          <ResourceLink
            kind="Namespace"
            name={metadata.namespace}
            title={metadata.uid}
            namespace={null}
          />
        </DetailsItem>
      )}
      <DetailsItem
        label={t('Labels')}
        obj={resource}
        path="metadata.labels"
        valueClassName="details-item__value--labels"
        onEdit={() =>
          launchModal(ModalKeys.EDIT_LABELS, { resource, resourceModel })
        }
        canEdit={showLabelEditor && canUpdate}
        editAsGroup
      >
        <LabelList kind={reference} labels={metadata.labels} />
      </DetailsItem>
      {showAnnotations && (
        <DetailsItem
          label={t('Annotations')}
          obj={resource}
          path="metadata.annotations"
        >
          {canUpdate ? (
            <Button
              data-test="edit-annotations"
              type="button"
              isInline
              onClick={() =>
                launchModal(ModalKeys.EDIT_ANN, {
                  resource,
                  resourceModel,
                })
              }
              variant="link"
            >
              {t('{{count}} annotation', {
                count: _.size(metadata.annotations),
              })}
              <PencilAltIcon className="co-icon-space-l pf-c-button-icon--plain" />
            </Button>
          ) : (
            t('{{count}} annotation', {
              count: _.size(metadata.annotations),
            })
          )}
        </DetailsItem>
      )}
      {children}
      <DetailsItem
        label={t('Created at')}
        obj={resource}
        path="metadata.creationTimestamp"
      >
        <Timestamp timestamp={metadata.creationTimestamp} />
      </DetailsItem>
      <DetailsItem
        label={t('Owner')}
        obj={resource}
        path="metadata.ownerReferences"
      >
        <OwnerReferences resource={resource} />
      </DetailsItem>
    </dl>
  );
};
