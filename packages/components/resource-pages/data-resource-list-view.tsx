import * as React from 'react';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreateLink,
  ListPageFilter,
  RowProps,
  TableColumn,
  TableData,
  useActiveColumns,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import classNames from 'classnames';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { sortable } from '@patternfly/react-table';
import { BucketClassType, NOOBAA_PROVIDER_MAP } from '../../constants';
import { NooBaaNamespaceStoreModel } from '../../models';
import { BucketClassKind, NamespaceStoreKind } from '../../types';
import { referenceForModel } from '../../utils';
import { OperandStatus } from '../../utils/generics/operand-status';
import ResourceLink from '../../utils/generics/resource-link';
import { CustomKebabItemsType, Kebab } from '../../utils/kebab/kebab';
import {
  LaunchModal,
  ModalMap,
  useModalLauncher,
} from '../../utils/modals/modalLauncher';
import { getName } from '../../utils/selectors/k8s';
import { bucketClassResource, nameSpaceStoreResource } from '../resources';
import './data-resource-list-view.scss';

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

type ResourceTableProps = {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
  rowData: CustomData;
};

const ResourceTable: React.FC<ResourceTableProps> = (props) => {
  const { t } = useTranslation();
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

  const [columns] = useActiveColumns({
    columns: tableColumns,
    showNamespaceOverride: false,
    columnManagementID: null,
  });
  return (
    <VirtualizedTable
      {...props}
      aria-label={t('Resource Page')}
      columns={columns}
      Row={RowRenderer}
    />
  );
};

type CustomData = {
  launchModal: LaunchModal;
  kebabActions?: CustomKebabItemsType;
  bucketPolicyMap: { [key: string]: { value: number } };
};

const RowRenderer: React.FC<RowProps<NamespaceStoreKind, CustomData>> = ({
  obj,
  activeColumnIDs,
  rowData,
}) => {
  const { t } = useTranslation();
  const { launchModal, kebabActions, bucketPolicyMap } = rowData;
  const dataResourceName = getName(obj);
  const bucketsCount = bucketPolicyMap[dataResourceName] || 0;
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
        {t('{{bucketsCount}} Buckets', { bucketsCount })}
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

type DataResourceListViewProps = {
  actions?: ModalMap;
  kebabActions?: CustomKebabItemsType;
};

export const DataResourceListView: React.FC<DataResourceListViewProps> = ({
  actions,
  kebabActions,
}) => {
  const { t } = useTranslation();
  const [Modal, modalProps, launchModal] = useModalLauncher(actions);

  const [bucketPolicies, bucketPoliciesLoaded, bucketPoliciesError] =
    useK8sWatchResource<BucketClassKind[]>(bucketClassResource);
  const bucketPolicyMap = React.useMemo(
    () =>
      bucketPoliciesLoaded && !bucketPoliciesError
        ? bucketPolicies?.reduce((bcMap, bc) => {
            const namespacePolicy = bc?.spec?.namespacePolicy;
            if (namespacePolicy?.type === BucketClassType.SINGLE) {
              const ns = namespacePolicy?.single?.resource;
              bcMap[ns] = bcMap[ns] + 1 || 1;
            } else if (namespacePolicy?.type === BucketClassType.MULTI) {
              const dataResourceSet = new Set([
                namespacePolicy?.multi?.writeResource,
                ...namespacePolicy?.multi?.readResources,
              ]);
              dataResourceSet.forEach((ns) => (bcMap[ns] = bcMap[ns] + 1 || 1));
            }
            return bcMap;
          }, {})
        : {},
    [bucketPolicies, bucketPoliciesLoaded, bucketPoliciesError]
  );

  const [dataResources, dataResourcesLoaded, dataResourcesError] =
    useK8sWatchResource<K8sResourceCommon[]>(nameSpaceStoreResource);
  const [data, filteredData, onFilterChange] = useListPageFilter(dataResources);
  const loaded = dataResourcesLoaded && bucketPoliciesLoaded;
  const loadError = dataResourcesError || bucketPoliciesError;
  const createLink = `/mcgms/resource/${referenceForModel(
    NooBaaNamespaceStoreModel
  )}/create/~new`;

  return (
    <>
      <Modal {...modalProps} />
      <div>
        <div className="filter-data-resource__search-box">
          <ListPageFilter
            data={data}
            loaded={loaded}
            onFilterChange={onFilterChange}
            hideColumnManagement={true}
            nameFilterPlaceholder={t('Filter by policy name')}
            labelFilterPlaceholder={t('Filter by policy label')}
          />
        </div>
        <div className="create-data-resource__button">
          <ListPageCreateLink to={createLink}>
            {t('Create Data resource')}
          </ListPageCreateLink>
        </div>
      </div>
      <ListPageBody>
        <ResourceTable
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
          loadError={loadError}
          rowData={{
            launchModal,
            kebabActions,
            bucketPolicyMap,
          }}
        />
      </ListPageBody>
    </>
  );
};
