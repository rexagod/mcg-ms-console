import * as React from 'react';
import {
  K8sResourceCommon,
  RowProps,
  TableColumn,
  TableData,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { sortable } from '@patternfly/react-table';
import {
  BucketClassType,
  BUCKET_CLASS_DETAILS_PATH,
  NOOBAA_PROVIDER_MAP,
} from '../../constants';
import { NooBaaNamespaceStoreModel } from '../../models';
import { BucketClassKind, NamespaceStoreKind } from '../../types';
import { referenceForModel } from '../../utils';
import { OperandStatus } from '../../utils/generics/operand-status';
import ResourceLink from '../../utils/generics/resource-link';
import { CustomKebabItemsType, Kebab } from '../../utils/kebab/kebab';
import { GenericListPage } from '../../utils/list-page/list-page';
import { LaunchModal } from '../../utils/modals/modalLauncher';
import { getName } from '../../utils/selectors/k8s';
import { bucketClassResource } from '../resources';
import { MCGResourcePopOver } from './ResourcePopOver';

const tableColumnInfo = [
  { className: '', id: 'name' },
  {
    className: '',
    id: 'status',
  },
  {
    className: classNames('pf-m-hidden', 'pf-m-visible-on-md'),
    id: 'provider',
  },
  {
    className: classNames('pf-m-hidden', 'pf-m-visible-on-lg'),
    id: 'buckets',
  },
  { className: 'dropdown-kebab-pf pf-c-table__action', id: '' },
];

export const RowRenderer: React.FC<RowProps<NamespaceStoreKind, CustomData>> =
  ({ obj, activeColumnIDs, rowData }) => {
    const { t } = useTranslation();
    const { launchModal, kebabActions, resourceMap } = rowData;
    const dataResourceName = getName(obj);
    const bucketsCount = resourceMap[dataResourceName]?.length || 0;
    const path = `/mcgms/resource/${referenceForModel(
      NooBaaNamespaceStoreModel
    )}/${dataResourceName}`;
    return (
      <>
        <TableData {...tableColumnInfo[0]} activeColumnIDs={activeColumnIDs}>
          <ResourceLink
            resourceModel={NooBaaNamespaceStoreModel}
            resourceName={dataResourceName}
            link={path}
          />
        </TableData>
        <TableData {...tableColumnInfo[1]} activeColumnIDs={activeColumnIDs}>
          <OperandStatus operand={obj} />
        </TableData>
        <TableData {...tableColumnInfo[2]} activeColumnIDs={activeColumnIDs}>
          {NOOBAA_PROVIDER_MAP[obj?.spec?.type]}
        </TableData>
        <TableData {...tableColumnInfo[3]} activeColumnIDs={activeColumnIDs}>
          {bucketsCount ? (
            <MCGResourcePopOver
              label={t('{{bucketsCount}} Buckets', { bucketsCount })}
              resourceList={resourceMap[dataResourceName]}
              headerContent={t('Connected Buckets')}
              resourceDetailsURL={BUCKET_CLASS_DETAILS_PATH}
            />
          ) : (
            t('{{bucketsCount}} Buckets', { bucketsCount })
          )}
        </TableData>
        <TableData {...tableColumnInfo[4]} activeColumnIDs={activeColumnIDs}>
          <Kebab
            launchModal={launchModal}
            extraProps={{
              resource: obj,
              resourceModel: NooBaaNamespaceStoreModel,
            }}
            customKebabItems={kebabActions}
          />
        </TableData>
      </>
    );
  };

export const useDataResourceList = () => {
  const { t } = useTranslation();

  const [bucketPolicies, bucketPoliciesLoaded, bucketPoliciesError] =
    useK8sWatchResource<BucketClassKind[]>(bucketClassResource);

  const tableColumns = React.useMemo<TableColumn<K8sResourceCommon>[]>(
    () => [
      {
        title: t('Name'),
        sort: 'metadata.name',
        transforms: [sortable],
        props: {
          className: tableColumnInfo[0].className,
        },
        id: tableColumnInfo[0].id,
      },
      {
        title: t('Status'),
        props: {
          className: tableColumnInfo[1].className,
        },
        id: tableColumnInfo[1].id,
      },
      {
        title: t('Provider'),
        props: {
          className: tableColumnInfo[2].className,
        },
        id: tableColumnInfo[2].id,
      },
      {
        title: t('Buckets'),
        props: {
          className: tableColumnInfo[3].className,
        },
        id: tableColumnInfo[3].id,
      },
      {
        title: '',
        props: {
          className: tableColumnInfo[4].className,
        },
        id: tableColumnInfo[4].id,
      },
    ],
    [t]
  );

  const bucketPolicyMap = React.useMemo(
    () =>
      bucketPoliciesLoaded && !bucketPoliciesError
        ? bucketPolicies?.reduce((bcMap: BucketPolicyMap, bc) => {
            const bucketName = bc?.metadata?.name;
            const namespacePolicy = bc?.spec?.namespacePolicy;
            if (namespacePolicy?.type === BucketClassType.SINGLE) {
              const ns = namespacePolicy?.single?.resource;
              bcMap[ns] = bcMap[ns] ? [...bcMap[ns], bucketName] : [bucketName];
            } else if (namespacePolicy?.type === BucketClassType.MULTI) {
              const dataResourceSet = new Set([
                namespacePolicy?.multi?.writeResource,
                ...namespacePolicy?.multi?.readResources,
              ]);
              dataResourceSet.forEach(
                (ns) =>
                  (bcMap[ns] = bcMap[ns]
                    ? [...bcMap[ns], bucketName]
                    : [bucketName])
              );
            }
            return bcMap;
          }, {})
        : {},
    [bucketPolicies, bucketPoliciesLoaded, bucketPoliciesError]
  );

  return [tableColumns, bucketPolicyMap];
};

export const DataResourceListView: React.FC = () => {
  const { t } = useTranslation();
  const [tableColumns, bucketPolicyMap] = useDataResourceList();

  return (
    <GenericListPage
      resourceModel={NooBaaNamespaceStoreModel}
      resourceMap={bucketPolicyMap}
      tableColumns={tableColumns as TableColumn<K8sResourceCommon>[]}
      createButtonTitle={t('Create data source')}
      kebabActions={(t) => ({
        Delete: {
          value: t('Delete data source'),
        },
      })}
    >
      {RowRenderer}
    </GenericListPage>
  );
};

// ToDo(Deb): Add Data resources names instead and show them in a pop-up
type BucketPolicyMap = {
  [key: string]: string[];
};

type CustomData = {
  launchModal: LaunchModal;
  kebabActions?: CustomKebabItemsType;
  resourceMap: BucketPolicyMap;
};
