import { BasicAuthCredentialsInput } from '@/types/cloud/project/ai/BasicAuthCredentialsInput';
import { SshCredentialsInput } from '@/types/cloud/project/ai/SshCredentialsInput';

/** AI Solutions data store git credentials input */
export interface GitCredentialsInput {
  /** Basic Auth data store credentials */
  basicAuth?: BasicAuthCredentialsInput;
  /** SSH data store credentials */
  sshKeypair?: SshCredentialsInput;
}
