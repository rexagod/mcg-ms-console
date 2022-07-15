import { DATA_FEDERATION_NAMESPACE } from '../constants/common';

export const dataSourceNSFS = (
  name: string,
  pvcName: string,
  subPath: string
) => ({
  apiVersion: 'noobaa.io/v1alpha1',
  kind: 'NamespaceStore',
  metadata: {
    name,
    namespace: DATA_FEDERATION_NAMESPACE,
  },
  spec: {
    nsfs: {
      pvcName,
      subPath,
    },
    type: 'nsfs',
  },
});
