import { TokenRoleEnum } from '@/types/cloud/project/ai/TokenRoleEnum';

/** AI Solutions Application Token Spec Object to create a notebook */
export interface TokenSpec {
  /** Application token label selector */
  labelSelector: string;
  /** Application token name */
  name: string;
  /** Public Cloud Storage Region */
  region: string;
  /** Role granted by this application token */
  role: TokenRoleEnum;
}
