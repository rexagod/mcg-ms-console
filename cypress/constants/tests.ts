// OBC
export const BUCKET_CLAIM_NAME = 'e2e-bucket-claim';

// Status card
export const STATUS_CARD_TITLE = 'Data Federation service';

// Bucket policy
export const SINGLE_BUCKET_POLICY = 'e2e-bucket-single';
export const PVC_NAME = 'e2e-pvc';
export const DATA_SOURCE_NAME = 'e2e-nsfs-data-source';

// constants for data source test cases
export const TEST_DATA_SOURCE = 'testing-data-source';
export enum Providers {
  AWS = 'AWS S3',
  AZURE = 'Azure Blob',
  S3 = 'S3 Compatible',
  PVC = 'PVC',
  IBM = 'IBM COS',
  FILESYSTEM = 'Filesystem',
}
export const DATA_SOURCE_INPUTS = {
  name: TEST_DATA_SOURCE,
  provider: Providers.AWS,
  accessKey: 'test-access-key',
  secretKey: 'test-secret-key',
  targetBucket: 'test-target-bucket',
};
