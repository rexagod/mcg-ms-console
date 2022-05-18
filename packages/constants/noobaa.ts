import * as _ from 'lodash';
import { BC_PROVIDERS } from './providers';

export enum StoreType {
  BS = 'BackingStore',
  NS = 'NamespaceStore',
}

export enum BucketClassType {
  SINGLE = 'Single',
  MULTI = 'Multi',
}

export const PROVIDERS_NOOBAA_MAP = {
  [BC_PROVIDERS.AWS]: 'awsS3' as const,
  [BC_PROVIDERS.S3]: 's3Compatible' as const,
  [BC_PROVIDERS.AZURE]: 'azureBlob' as const,
  [BC_PROVIDERS.GCP]: 'googleCloudStorage' as const,
  [BC_PROVIDERS.PVC]: 'pvPool' as const,
  [BC_PROVIDERS.IBM]: 'ibmCos' as const,
  [BC_PROVIDERS.FILESYSTEM]: 'nsfs' as const,
};

export const NS_PROVIDERS_NOOBAA_MAP = _.pick(
  PROVIDERS_NOOBAA_MAP,
  BC_PROVIDERS.AWS,
  BC_PROVIDERS.S3,
  BC_PROVIDERS.AZURE,
  BC_PROVIDERS.IBM,
  BC_PROVIDERS.FILESYSTEM
);

export const NOOBAA_TYPE_MAP = {
  [BC_PROVIDERS.AWS]: 'aws-s3' as const,
  [BC_PROVIDERS.S3]: 's3-compatible' as const,
  [BC_PROVIDERS.AZURE]: 'azure-blob' as const,
  [BC_PROVIDERS.GCP]: 'google-cloud-storage' as const,
  [BC_PROVIDERS.PVC]: 'pv-pool' as const,
  [BC_PROVIDERS.IBM]: 'ibm-cos' as const,
  [BC_PROVIDERS.FILESYSTEM]: 'nsfs' as const,
};

export const NS_NOOBAA_TYPE_MAP = _.pick(
  NOOBAA_TYPE_MAP,
  BC_PROVIDERS.AWS,
  BC_PROVIDERS.S3,
  BC_PROVIDERS.AZURE,
  BC_PROVIDERS.IBM
);

export const NOOBAA_PROVIDER_MAP = {
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.AWS]]: BC_PROVIDERS.AWS as const,
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.AZURE]]: BC_PROVIDERS.AZURE as const,
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.S3]]: BC_PROVIDERS.S3 as const,
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.IBM]]: BC_PROVIDERS.IBM as const,
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.FILESYSTEM]]: BC_PROVIDERS.FILESYSTEM as const,
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.GCP]]: BC_PROVIDERS.GCP as const,
  [NOOBAA_TYPE_MAP[BC_PROVIDERS.PVC]]: BC_PROVIDERS.PVC as const,
};

export const BUCKET_LABEL_NOOBAA_MAP = {
  [BC_PROVIDERS.AWS]: 'targetBucket',
  [BC_PROVIDERS.S3]: 'targetBucket',
  [BC_PROVIDERS.AZURE]: 'targetBlobContainer',
  [BC_PROVIDERS.GCP]: 'targetBucket',
  [BC_PROVIDERS.IBM]: 'targetBucket',
};
