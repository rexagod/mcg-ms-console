import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";

export const referenceForModel = (model: K8sModel) =>
  `${model.apiGroup}~${model.apiVersion}~${model.kind}`;
