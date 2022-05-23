import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const ClusterServiceVersionModel: K8sModel = {
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

export const InfrastructureModel: K8sModel = {
  label: 'Infrastructure',
  labelKey: 'Infrastructure',
  labelPlural: 'Infrastructures',
  labelPluralKey: 'Infrastructures',
  apiVersion: 'v1',
  apiGroup: 'config.openshift.io',
  plural: 'infrastructures',
  abbr: 'INF',
  namespaced: false,
  kind: 'Infrastructure',
  id: 'infrastructure',
  crd: true,
};

export const SubscriptionModel: K8sModel = {
  kind: 'Subscription',
  label: 'Subscription',
  labelKey: 'Subscription',
  labelPlural: 'Subscriptions',
  labelPluralKey: 'Subscriptions',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'SUB',
  namespaced: true,
  crd: true,
  plural: 'subscriptions',
  legacyPluralURL: true,
};

export const ProjectModel: K8sModel = {
  apiVersion: 'v1',
  apiGroup: 'project.openshift.io',
  label: 'Project',
  labelKey: 'Project',
  plural: 'projects',
  abbr: 'PR',
  kind: 'Project',
  id: 'project',
  labelPlural: 'Projects',
  labelPluralKey: 'Projects',
};
