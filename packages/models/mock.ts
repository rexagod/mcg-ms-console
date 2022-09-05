import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

// This model is used by HorizontalNav to limit the exposure of tabs to Data Access Service dashboard
export const DFRMock: K8sModel = {
  label: 'DataAccessService',
  labelPlural: 'DataAccessServices',
  apiVersion: 'v1',
  apiGroup: 'console.mcgms.io',
  plural: 'dataaccessservices',
  abbr: 'DAS',
  namespaced: true,
  kind: 'DataAccessService',
  crd: true,
};
