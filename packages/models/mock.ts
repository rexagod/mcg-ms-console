import { K8sKind } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

// This model is used by HorizontalNav to limit the exposure of tabs to Data Federation dashboard
export const DFRMock: K8sKind = {
    label: 'DataFederation',
    labelPlural: 'DataFederations',
    apiVersion: 'v1',
    apiGroup: 'console.dfr.io',
    plural: 'datafederations',
    abbr: 'DF',
    namespaced: true,
    kind: 'DataFederation',
    crd: true,
};
