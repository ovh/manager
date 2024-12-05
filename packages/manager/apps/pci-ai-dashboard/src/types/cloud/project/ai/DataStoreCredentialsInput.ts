import { GitCredentialsInput } from '@/types/cloud/project/ai/GitCredentialsInput';
import { S3CredentialsInput } from '@/types/cloud/project/ai/S3CredentialsInput';

/** AI Solutions data store credentials Object */
export interface DataStoreCredentialsInput {
  /** Git data store credentials */
  git?: GitCredentialsInput;
  /** S3 data store credentials */
  s3?: S3CredentialsInput;
}
