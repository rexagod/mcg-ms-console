import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const PersistentVolumeClaimModel: K8sModel = {
  label: 'PersistentVolumeClaim',
  labelKey: 'plugin__dfr-console~PersistentVolumeClaim',
  apiVersion: 'v1',
  plural: 'persistentvolumeclaims',
  abbr: 'PVC',
  namespaced: true,
  kind: 'PersistentVolumeClaim',
  id: 'persistentvolumeclaim',
  labelPlural: 'PersistentVolumeClaims',
  labelPluralKey: 'plugin__dfr-console~PersistentVolumeClaims',
};

export const SecretModel: K8sModel = {
  apiVersion: 'v1',
  label: 'Secret',
  labelKey: 'plugin__dfr-console~Secret',
  plural: 'secrets',
  abbr: 'S',
  namespaced: true,
  kind: 'Secret',
  id: 'secret',
  labelPlural: 'Secrets',
  labelPluralKey: 'plugin__dfr-console~Secrets',
};
