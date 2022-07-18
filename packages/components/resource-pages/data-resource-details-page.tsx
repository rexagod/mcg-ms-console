import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { TFunction } from 'i18next';
import { RouteComponentProps } from 'react-router';
import {
  DATA_FEDERATION,
  DATA_FEDERATION_NAMESPACE,
  DATA_RESOURCE_LIST_PATH,
} from '../../constants';
import { NooBaaNamespaceStoreModel } from '../../models';
import { NamespaceStoreKind } from '../../types';
import { referenceForModel } from '../../utils';
import DetailsPage from '../../utils/details-page/DetailsPage';
import { SectionHeading } from '../../utils/heading/page-heading';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';
import { Kebab } from '../../utils/kebab/kebab';
import {
  LaunchModal,
  useModalLauncher,
} from '../../utils/modals/modalLauncher';
import { CommonDetails } from './CommonDetails';
import ProviderDetails from './Providers';

type DetailsProps = {
  obj: NamespaceStoreKind;
};

type DetailsType = (
  launchModal: LaunchModal,
  t: TFunction
) => React.FC<DetailsProps>;

const DataResourceDetails: DetailsType =
  (launchModal, t) =>
  // eslint-disable-next-line react/display-name
  ({ obj }) => {
    return (
      <CommonDetails
        resource={obj}
        launchModal={launchModal}
        resourceModel={NooBaaNamespaceStoreModel}
      >
        <SectionHeading text={t('plugin__mcg-ms-console~Provider details')} />
        <div className="row">
          <div className="col-sm-6">
            <ProviderDetails resource={obj} />
          </div>
        </div>
      </CommonDetails>
    );
  };

type DataResourceDetailsPageProps = {
  match: RouteComponentProps<{ resourceName: string; plural: string }>['match'];
};

const DataResourceDetailsPage: React.FC<DataResourceDetailsPageProps> = ({
  match,
}) => {
  const { t } = useCustomTranslation();
  const { resourceName: name } = match.params;
  const [resource, loaded, loadError] = useK8sWatchResource<NamespaceStoreKind>(
    {
      kind: referenceForModel(NooBaaNamespaceStoreModel),
      name,
      namespace: DATA_FEDERATION_NAMESPACE,
      isList: false,
    }
  );

  const [Modal, modalProps, launchModal] = useModalLauncher();

  const breadcrumbs = [
    {
      name: DATA_FEDERATION,
      path: '/mcgms/cluster',
    },
    {
      name: t('Data source'),
      path: '/mcgms/cluster/resource/noobaa.io~v1alpha1~NamespaceStore',
    },
    {
      name: t('Data source details'),
      path: '',
    },
  ];

  const Details = React.useMemo(
    () => DataResourceDetails(launchModal, t),
    [launchModal, t]
  );

  const actions = React.useCallback(() => {
    return (
      <Kebab
        toggleType="Dropdown"
        launchModal={launchModal}
        extraProps={{
          resource: resource,
          resourceModel: NooBaaNamespaceStoreModel,
          redirectPath: DATA_RESOURCE_LIST_PATH,
        }}
        customKebabItems={(t) => ({
          Delete: {
            value: t('plugin__mcg-ms-console~Delete data source'),
          },
        })}
      />
    );
  }, [launchModal, resource]);

  return (
    <>
      <Modal {...modalProps} />
      <DetailsPage
        loaded={loaded}
        loadError={loadError}
        breadcrumbs={breadcrumbs}
        actions={actions}
        resourceModel={NooBaaNamespaceStoreModel}
        resource={resource}
        pages={[
          {
            href: '',
            name: 'Details',
            component: Details as any,
          },
        ]}
      />
    </>
  );
};

export default DataResourceDetailsPage;
