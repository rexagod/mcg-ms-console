import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { BucketClassType } from '../constants';
import { Condition } from './k8s';
import { nsSecretObject, nsSpecProvider, nsSpecType } from './providers';

export type NamespaceStoreKind = K8sResourceCommon & {
  spec: {
    [key in nsSpecProvider]: {
      [key: string]: string | nsSecretObject;
    };
  } & {
    type: nsSpecType;
  };
  status?: {
    conditions?: Condition[];
    phase?: string;
  };
};

export type BucketClassKind = K8sResourceCommon & {
  spec: {
    namespacePolicy: SingleBC | MultiBC;
  };
};

export type SingleBC = {
  single: {
    resource: string;
  };
  type: BucketClassType.SINGLE;
};

export type MultiBC = {
  multi: {
    writeResource: string;
    readResources: string[];
  };
  type: BucketClassType.MULTI;
};
