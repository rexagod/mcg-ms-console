import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const PersistentVolumeClaimModel: K8sModel = {
  label: 'PersistentVolumeClaim',
  labelKey: 'PersistentVolumeClaim',
  apiVersion: 'v1',
  plural: 'persistentvolumeclaims',
  abbr: 'PVC',
  namespaced: true,
  kind: 'PersistentVolumeClaim',
  id: 'persistentvolumeclaim',
  labelPlural: 'PersistentVolumeClaims',
  labelPluralKey: 'PersistentVolumeClaims',
};

export const SecretModel: K8sModel = {
  apiVersion: 'v1',
  label: 'Secret',
  labelKey: 'Secret',
  plural: 'secrets',
  abbr: 'S',
  namespaced: true,
  kind: 'Secret',
  id: 'secret',
  labelPlural: 'Secrets',
  labelPluralKey: 'Secrets',
};

export const StorageClassModel: K8sModel = {
  label: 'StorageClass',
  labelKey: 'StorageClass',
  labelPlural: 'StorageClasses',
  labelPluralKey: 'StorageClasses',
  apiVersion: 'v1',
  apiGroup: 'storage.k8s.io',
  plural: 'storageclasses',
  abbr: 'SC',
  namespaced: false,
  kind: 'StorageClass',
  id: 'storageclass',
};

export const DeploymentModel: K8sModel = {
  label: 'Deployment',
  labelKey: 'Deployment',
  apiVersion: 'v1',
  apiGroup: 'apps',
  plural: 'deployments',
  abbr: 'D',
  namespaced: true,
  propagationPolicy: 'Foreground',
  kind: 'Deployment',
  id: 'deployment',
  labelPlural: 'Deployments',
  labelPluralKey: 'Deployments',
};

export const ConfigMapModel: K8sModel = {
  apiVersion: 'v1',
  label: 'ConfigMap',
  labelKey: 'ConfigMap',
  plural: 'configmaps',
  abbr: 'CM',
  namespaced: true,
  kind: 'ConfigMap',
  id: 'configmap',
  labelPlural: 'ConfigMaps',
  labelPluralKey: 'ConfigMaps',
};
