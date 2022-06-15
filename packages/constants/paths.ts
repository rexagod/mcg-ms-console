import {
  NooBaaBucketClassModel,
  NooBaaNamespaceStoreModel,
  NooBaaObjectBucketClaimModel,
} from '../models';
import { referenceForModel } from '../utils';

export const OBC_LIST_PATH = `/k8s/all-namespaces/${referenceForModel(
  NooBaaObjectBucketClaimModel
)}`;
export const BUCKET_CLASS_LIST_PATH = `/mcgms/cluster/resource/${referenceForModel(
  NooBaaBucketClassModel
)}`;
export const DATA_RESOURCE_LIST_PATH = `/mcgms/cluster/resource/${referenceForModel(
  NooBaaNamespaceStoreModel
)}`;

export const BUCKET_CLASS_DETAILS_PATH = `/mcgms/resource/${referenceForModel(
  NooBaaBucketClassModel
)}`;
export const DATA_RESOURCE_DETAILS_PATH = `/mcgms/resource/${referenceForModel(
  NooBaaNamespaceStoreModel
)}`;
