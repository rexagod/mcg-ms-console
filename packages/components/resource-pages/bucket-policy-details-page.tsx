import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { DATA_FEDERATION_NAMESPACE } from '../../constants';
import { NooBaaBucketClassModel } from '../../models';
import { BucketClassKind, K8sResourceKind, PagePropsRoute } from '../../types';
import { referenceForModel, getPhase, getDataResources } from '../../utils';
import DetailsPage, {
  ResourceSummary,
} from '../../utils/details-page/DetailsPage';
import { SectionHeading } from '../../utils/heading/page-heading';
import { Kebab } from '../../utils/kebab/kebab';
import { useModalLauncher } from '../../utils/modals/modalLauncher';
import { Status } from '../../utils/status/Status';
import { GetSecret } from '../mcg/secret';
import { bucketClaimResource } from '../resources';
import { DataResourcesPopOver, OBCPopOver } from './ResourcePopOver';

type BPDetailsProps = {
  obj?: BucketClassKind;
};

type OBCList = {
  name: string;
  ns: string;
}[];

type ReplicationList = {
  rule_id?: string;
  destination_bucket: string;
}[];

const getReplicationOBCs = (jsonString: string) => {
  try {
    return (JSON.parse(jsonString) as ReplicationList)?.map(
      (repObj) => repObj?.destination_bucket
    );
  } catch {
    return [];
  }
};

const BPStatus: React.FC<BPDetailsProps> = ({ obj }) => (
  <Status status={getPhase(obj)} />
);

export const BPDetails: React.FC<BPDetailsProps> = ({ obj }) => {
  const { t } = useTranslation();
  const [Modal, modalProps, launchModal] = useModalLauncher();

  const [obcData, obcLoaded, obcError] =
    useK8sWatchResource<K8sResourceKind[]>(bucketClaimResource);

  const [bucketPolicyOBCList, replicationOBCList] = React.useMemo(() => {
    const bpOBCList: OBCList = [];
    const repOBCList: OBCList = [];
    if (obcLoaded && !obcError && !_.isEmpty(obj)) {
      const bucketPolicyName = obj?.metadata?.name;
      const replicationOBs = getReplicationOBCs(obj?.spec?.replicationPolicy);
      obcData?.forEach((obc) => {
        obc?.spec?.additionalConfig?.bucketclass === bucketPolicyName &&
          bpOBCList.push({
            name: obc?.metadata?.name,
            ns: obc?.metadata?.namespace,
          });
        replicationOBs?.includes(obc?.spec?.bucketName) &&
          repOBCList.push({
            name: obc?.metadata?.name,
            ns: obc?.metadata?.namespace,
          });
      });
    }
    return [bpOBCList, repOBCList];
  }, [obj, obcData, obcLoaded, obcError]);

  const policyType: string = obj?.spec?.namespacePolicy?.type;
  const dataResources = getDataResources(obj);
  const dataResourceCount = dataResources?.length;
  const dataResourceLabel = t('{{dataResourceCount}} data source', {
    dataResourceCount: dataResourceCount,
  });
  const obcCount = bucketPolicyOBCList?.length;
  const obcLabel = t('{{obcCount}} ObjectBucketClaim', {
    obcCount: obcCount,
  });
  const repCount = replicationOBCList?.length;
  const repLabel = t('{{repCount}} ObjectBucketClaim', {
    repCount: repCount,
  });

  return (
    <>
      <Modal {...modalProps} />
      <div className="co-m-pane__body">
        <SectionHeading text={t('Bucket Details')} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary
              resource={obj}
              launchModal={launchModal}
              resourceModel={NooBaaBucketClassModel}
            />
          </div>
          <div className="col-sm-6">
            <dt>{t('Status')}</dt>
            <dd>
              <BPStatus obj={obj} />
            </dd>
            <dt>{t('Policy type')}</dt>
            <dd>{policyType}</dd>
            <dt>{t('Data sources')}</dt>
            <dd>
              {!!dataResourceCount ? (
                <DataResourcesPopOver
                  label={dataResourceLabel}
                  dataResources={dataResources}
                />
              ) : (
                dataResourceLabel
              )}
            </dd>
            <dt>{t('ObjectBucketClaims')}</dt>
            <dd>
              {!!obcCount ? (
                <OBCPopOver label={obcLabel} obcDetails={bucketPolicyOBCList} />
              ) : (
                obcLabel
              )}
            </dd>
            <dt>{t('Replication buckets')}</dt>
            <dd>
              {!!repCount ? (
                <OBCPopOver label={repLabel} obcDetails={replicationOBCList} />
              ) : (
                repLabel
              )}
            </dd>
          </div>
        </div>
      </div>
      {
        /**
         * Passing [0]th index until UX is ready for one-to-many use case,
         * one bucket policy and multiple OBCs.
         */
        !!obcCount && (
          <GetSecret
            obj={{
              metadata: {
                name: bucketPolicyOBCList[0].name,
                namespace: bucketPolicyOBCList[0].ns,
              },
            }}
          />
        )
      }
    </>
  );
};

const kind = referenceForModel(NooBaaBucketClassModel);

const BucketPolicyDetailsPage: React.FC<PagePropsRoute> = ({ match }) => {
  const { t } = useTranslation();
  const { resourceName: name } = match.params;
  const namespace = DATA_FEDERATION_NAMESPACE;
  const [resource, loaded, error] = useK8sWatchResource<BucketClassKind>({
    kind,
    name,
    namespace,
    isList: false,
  });

  const [Modal, modalProps, launchModal] = useModalLauncher();

  const actions = React.useCallback(() => {
    return (
      <Kebab
        toggleType="Dropdown"
        launchModal={launchModal}
        extraProps={{
          resource,
          resourceModel: NooBaaBucketClassModel,
        }}
        customKebabItems={(t) => ({
          Delete: {
            value: t('Delete bucket'),
          },
        })}
      />
    );
  }, [launchModal, resource]);

  const breadcrumbs = [
    {
      name: t('Data Federation'),
      path: '/mcgms/cluster',
    },
    {
      name: t('Buckets'),
      path: '/mcgms/cluster/resource/noobaa.io~v1alpha1~BucketClass',
    },
    {
      name: t('Bucket details'),
      path: '',
    },
  ];

  return (
    <>
      <Modal {...modalProps} />
      <DetailsPage
        loaded={loaded}
        loadError={error}
        breadcrumbs={breadcrumbs}
        actions={actions}
        resourceModel={NooBaaBucketClassModel}
        resource={resource}
        pages={[
          {
            href: '',
            name: 'Details',
            component: BPDetails as any,
          },
        ]}
      />
    </>
  );
};

export default BucketPolicyDetailsPage;
