import {
  GroupVersionKind,
  OwnerReference,
  K8sGroupVersionKind,
  K8sResourceKindReference
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";

export const LAST_LANGUAGE_LOCAL_STORAGE_KEY = "bridge/last-language";

export const groupVersionFor = (apiVersion: string) => ({
  group: apiVersion.split("/").length === 2 ? apiVersion.split("/")[0] : "core",
  version:
    apiVersion.split("/").length === 2 ? apiVersion.split("/")[1] : apiVersion
});

export const referenceForOwnerRef = (
  ownerRef: OwnerReference
): GroupVersionKind =>
  referenceForGroupVersionKind(groupVersionFor(ownerRef.apiVersion).group)(
    groupVersionFor(ownerRef.apiVersion).version
  )(ownerRef.kind);

export const referenceForModel = (model: K8sModel) =>
  `${model.apiGroup}~${model.apiVersion}~${model.kind}`;

export const referenceForGroupVersionKind =
  (group: string) => (version: string) => (kind: string) =>
    getReference({ group, version, kind });

export const getReference = ({
  group,
  version,
  kind,
}: K8sGroupVersionKind): K8sResourceKindReference =>
  [group || 'core', version, kind].join('~');

export const resourcePathFromModel = (
  model: K8sModel,
  name?: string,
  namespace?: string
) => {
  const { plural, namespaced, crd } = model;

  let url = '/k8s/';

  if (!namespaced) {
    url += 'cluster/';
  }

  if (namespaced) {
    url += namespace ? `ns/${namespace}/` : 'all-namespaces/';
  }

  if (crd) {
    url += referenceForModel(model);
  } else if (plural) {
    url += plural;
  }

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }

  return url;
};

export const getLastLanguage = (): string =>
  localStorage.getItem(LAST_LANGUAGE_LOCAL_STORAGE_KEY);
