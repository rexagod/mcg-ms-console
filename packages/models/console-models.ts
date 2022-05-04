import { K8sKind } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const ClusterServiceVersionModel: K8sKind = {
    kind: 'ClusterServiceVersion',
    label: 'ClusterServiceVersion',
    labelPlural: 'ClusterServiceVersions',
    apiGroup: 'operators.coreos.com',
    apiVersion: 'v1alpha1',
    abbr: 'CSV',
    namespaced: true,
    crd: true,
    plural: 'clusterserviceversions',
    propagationPolicy: 'Foreground',
    legacyPluralURL: true,
};
