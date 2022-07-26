import {
  S3Client,
  CreateBucketCommand,
  CreateBucketCommandInput,
  CreateBucketCommandOutput,
  DeleteBucketCommandInput,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3';
import 'dotenv/config';
import log from 'loglevel';

log.setLevel('info');

class AWSClient {
  private s3Client: S3Client;

  constructor(accessKeyId: string, secretAccessKey: string, region: string) {
    const credentials =
      process.env.OPENSHIFT_CI || !accessKeyId || !secretAccessKey
        ? null
        : {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          };
    this.s3Client = new S3Client({
      credentials: credentials,
      region: region,
    });
  }

  async createBucket(bucketName: string): Promise<void> {
    if (!bucketName) {
      throw new Error('Invalid bucket name.');
    }
    log.info(`Creating bucket ${bucketName} ...`);
    const params: CreateBucketCommandInput = { Bucket: bucketName };
    const command = new CreateBucketCommand(params);
    try {
      const response: CreateBucketCommandOutput = await this.s3Client.send(
        command
      );
      log.info(
        `Bucket ${bucketName} created with location: ${response.Location}`
      );
    } catch (error) {
      if (error.name === 'BucketAlreadyOwnedByYou') {
        log.warn(error.message);
        return;
      }
      throw error;
    }
  }

  async deleteBucket(bucketName: string): Promise<void> {
    if (!bucketName) {
      throw new Error('Invalid bucket name.');
    }
    log.info(`Deleting bucket ${bucketName} ...`);
    const params: DeleteBucketCommandInput = { Bucket: bucketName };
    const command = new DeleteBucketCommand(params);
    await this.s3Client.send(command);
    log.info(`Bucket ${bucketName} deleted.`);
  }
}

/*
 * Anonymous function that runs a hook.
 */
(async () => {
  const awsClient = new AWSClient(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_REGION
  );
  const singleDataSourceBucket = process.env.AWS_SINGLE_DATA_SOURCE_BUCKET;
  const hook = process.argv[2];
  switch (hook) {
    case 'pre-tests':
      await awsClient.createBucket(singleDataSourceBucket);
      break;
    case 'post-tests':
      await awsClient.deleteBucket(singleDataSourceBucket);
      break;
    default:
      throw new Error(`Hook "${hook}" not found.`);
  }
})().catch((error) => {
  log.error(error);
  process.exit(1);
});
