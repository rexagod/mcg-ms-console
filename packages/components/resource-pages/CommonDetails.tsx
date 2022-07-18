import * as React from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import classNames from 'classnames';
import { Flex, FlexItem, Title } from '@patternfly/react-core';
import { Conditions } from '../../utils/details-page/Conditions';
import { ResourceSummary } from '../../utils/details-page/DetailsPage';
import { SectionHeading } from '../../utils/heading/page-heading';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';
import { LaunchModal } from '../../utils/modals/modalLauncher';
import './resources.scss';

type DetailsItemProps = {
  field: string;
  padChildElement?: boolean; // Add slight padding to the left for cascade effect
  showBorder?: boolean;
};

export const DetailsItem: React.FC<DetailsItemProps> = ({
  field,
  children,
  padChildElement = false,
  showBorder = false,
}) => (
  <Flex
    direction={{ default: 'column' }}
    className={classNames('details-item', {
      'details-item--border': showBorder,
    })}
  >
    <FlexItem>
      <Title headingLevel="h6" size="md">
        {field}
      </Title>
    </FlexItem>
    <FlexItem
      className={classNames({ 'details-item__child--pad': padChildElement })}
    >
      {children}
    </FlexItem>
  </Flex>
);

type CommonDetailsSectionProps = {
  resource: K8sResourceCommon;
  resourceModel: K8sModel;
  launchModal: LaunchModal;
};

export const CommonDetails: React.FC<CommonDetailsSectionProps> = ({
  resource,
  resourceModel,
  children,
  launchModal,
}) => {
  const { t } = useCustomTranslation();

  return (
    <>
      <div className="co-m-pane__body">
        <SectionHeading text={t('Data source overview')} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary
              resource={resource}
              launchModal={launchModal}
              resourceModel={resourceModel}
            />
          </div>
        </div>
      </div>
      <div className="co-m-pane__body">{children}</div>
      <div className="co-m-pane__body">
        <div className="row">
          <div className="co-m-pane__body">
            <SectionHeading text={t('Conditions')} />
            <Conditions conditions={(resource as any)?.status?.conditions} />
          </div>
        </div>
      </div>
    </>
  );
};
