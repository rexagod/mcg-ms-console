import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { BucketClassType } from '../constants';
import { K8sResourceCondition } from './k8s';
import { nsSecretObject, nsSpecProvider, nsSpecType } from './providers';

export type NamespaceStoreKind = K8sResourceCommon & {
  spec: {
    [key in nsSpecProvider]: {
      [key: string]: string | nsSecretObject;
    };
  } & {
    type: nsSpecType;
  };
  status: {
    conditions: K8sResourceCondition[];
  };
};

export type BucketClassKind = K8sResourceCommon & {
  spec: {
    namespacePolicy:
      | {
          single: {
            resource: string;
          };
          type: BucketClassType.SINGLE;
        }
      | {
          multi: {
            writeResource: string;
            readResources: string[];
          };
          type: BucketClassType.MULTI;
        };
  };
};
