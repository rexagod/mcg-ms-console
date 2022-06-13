import * as React from 'react';
import {
  K8sResourceCommon,
  getAPIVersionForModel,
  k8sCreate,
} from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Title } from '@patternfly/react-core';
import {
  CACHE_ANN,
  OBC_NS_ANN,
  DEFAULT_TTL,
  DEFAULT_BACKING_STORE,
  BS_ANN,
  BucketClassType,
  DATA_FEDERATION_NAMESPACE,
  EDIT_DATA_RESOURCES,
} from '../../constants';
import { NooBaaBucketClassModel, NooBaaSystemModel } from '../../models';
import { ListKind } from '../../types';
import { referenceForModel } from '../../utils';
import { useK8sGet } from '../../utils/hooks/k8s-get-hook';
import { useModalLauncher } from '../../utils/modals/modalLauncher';
import { getName } from '../../utils/selectors/k8s';
import { BucketPolicyBody } from './bucket-policy-body';
import { BucketPolicyFooter } from './bucket-policy-footer';
import {
  bucketPolicyReducer,
  bucketPolicyInitialState,
  BucketPolicyState,
  BucketPolicyActionType,
} from './state';
import './bucket-policy.scss';

const extraMap = {
  [EDIT_DATA_RESOURCES]: React.lazy(
    () => import('../modals/data-resource/data-resource-create-modal')
  ),
};

const getPayload = (
  state: BucketPolicyState,
  ns: string,
  backingStore: string
) => {
  const metadata = {
    apiVersion: getAPIVersionForModel(NooBaaBucketClassModel),
    kind: NooBaaBucketClassModel.kind,
    metadata: {
      name: state.bucketName,
      namespace: ns,
      annotations: {
        [CACHE_ANN]:
          state.dataResourceType === BucketClassType.SINGLE &&
          state.cacheEnabled
            ? 'true'
            : 'false',
        [OBC_NS_ANN]: state.obcNamespace,
      },
    },
  };
  let payload = null;
  if (state.dataResourceType === BucketClassType.SINGLE && state.cacheEnabled) {
    payload = {
      ...metadata,
      spec: {
        namespacePolicy: {
          type: BucketClassType.CACHE,
          cache: {
            caching: {
              ttl: DEFAULT_TTL,
            },
            hubResource: state.readWriteSingle,
          },
        },
        placementPolicy: {
          tiers: [
            {
              backingStores: [backingStore],
            },
          ],
        },
      },
    };
  } else if (state.dataResourceType === BucketClassType.SINGLE) {
    payload = {
      ...metadata,
      spec: {
        namespacePolicy: {
          type: state.dataResourceType,
          single: {
            resource: state.readWriteSingle,
          },
        },
      },
    };
  } else if (state.dataResourceType === BucketClassType.MULTI) {
    payload = {
      ...metadata,
      spec: {
        namespacePolicy: {
          type: state.dataResourceType,
          multi: {
            writeResource: state.writeResourceMulti,
            readResources: state.readResourceMulti,
          },
        },
      },
    };
  }
  if (!_.isEmpty(state.replicationOBC)) {
    payload.spec.replicationPolicy = JSON.stringify(
      state.replicationOBC.map((obj) => ({
        rule_id: obj.obcName,
        destination_bucket: obj.targetBucket,
      }))
    );
  }
  return payload;
};

const CreateBucketPolicy: React.FC<CreateBucketPolicyProps> = ({
  history,
  match,
}) => {
  const { ns = DATA_FEDERATION_NAMESPACE } = match.params;

  const { t } = useTranslation();
  const [Modal, modalProps, launchModal] = useModalLauncher(extraMap);
  const [state, dispatch] = React.useReducer(
    bucketPolicyReducer,
    bucketPolicyInitialState
  );
  const [noobaa, noobaaLoaded, noobaaError] = useK8sGet<
    ListKind<K8sResourceCommon>
  >(NooBaaSystemModel, null, ns);
  const defaultBackingStore =
    noobaa?.items[0]?.metadata?.annotations?.[BS_ANN] || DEFAULT_BACKING_STORE;

  const onConfirm = () => {
    dispatch({ type: BucketPolicyActionType.SET_INPROGRESS, payload: true });
    const payload = getPayload(state, ns, defaultBackingStore);
    const promiseObj = k8sCreate({
      model: NooBaaBucketClassModel,
      data: payload,
    });
    promiseObj
      .then((obj) => {
        const resourcePath = `${referenceForModel(
          NooBaaBucketClassModel
        )}/${getName(obj)}`;
        history.push(`/mcgms/resource/${resourcePath}`);
      })
      .catch((err) => {
        dispatch({
          type: BucketPolicyActionType.SET_INPROGRESS,
          payload: false,
        });
        dispatch({
          type: BucketPolicyActionType.SET_ERROR_MESSAGE,
          payload: err?.message,
        });
      });
  };

  return (
    <>
      <Modal {...modalProps} />
      <div className="co-create-operand__header">
        <Title
          size="2xl"
          headingLevel="h1"
          className="co-create-operand__header-text"
        >
          {t('Create new Bucket')}
        </Title>
        <p className="help-block">
          {t(
            'A set of policies that would apply to all buckets (OBCs) created with the specific bucket policy. These policies include namespace and caching'
          )}
        </p>
      </div>
      <div className="create-bucket-policy__form">
        <BucketPolicyBody
          ns={ns}
          state={state}
          dispatch={dispatch}
          launchModal={launchModal}
        />
        <BucketPolicyFooter
          state={state}
          loaded={noobaaLoaded}
          error={noobaaError}
          onCancel={() => history.goBack()}
          onConfirm={onConfirm}
        />
      </div>
    </>
  );
};

type CreateBucketPolicyProps = RouteComponentProps<{
  ns: string;
  appName: string;
}>;

export default CreateBucketPolicy;
