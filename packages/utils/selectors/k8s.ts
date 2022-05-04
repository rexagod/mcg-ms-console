import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import * as _ from 'lodash';
import { GetAPIVersionForModel } from "../../types";

type GetStringProperty<T = K8sResourceCommon> = (resource: T) => string;

export const getName: GetStringProperty = (resource) =>
  resource?.metadata?.name;

export const getUID: GetStringProperty = (resource) => resource?.metadata?.uid;

export const hasLabel = (obj: K8sResourceCommon, label: string): boolean =>
  _.has(obj, ['metadata', 'labels', label]);

export const getLabel = <A extends K8sResourceCommon = K8sResourceCommon>(
  value: A,
  label: string,
  defaultValue?: string,
) => (_.has(value, 'metadata.labels') ? value.metadata.labels[label] : defaultValue);

export const getAnnotations = <A extends K8sResourceCommon = K8sResourceCommon>(
  value: A,
  defaultValue?: K8sResourceCommon['metadata']['annotations'],
) => (_.has(value, 'metadata.annotations') ? value.metadata.annotations : defaultValue);

/**
 * Provides apiVersion for a k8s model.
 * @param model k8s model
 * @returns The apiVersion for the model i.e `group/version`.
 * */
export const getAPIVersionForModel: GetAPIVersionForModel = (model) =>
  !model?.apiGroup ? model.apiVersion : `${model.apiGroup}/${model.apiVersion}`;

export const getNamespace = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  _.get(value, 'metadata.namespace') as K8sResourceCommon['metadata']['namespace'];

export const getAPIVersion = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  _.get(value, 'apiVersion') as K8sResourceCommon['apiVersion'];
