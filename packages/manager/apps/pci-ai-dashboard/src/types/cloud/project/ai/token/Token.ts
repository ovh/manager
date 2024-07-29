import { TokenSpec } from '@/types/cloud/project/ai/token/TokenSpec';
import { TokenStatus } from '@/types/cloud/project/ai/token/TokenStatus';

/** AI Solutions Application Token */
export interface Token {
  /** Application token creation date */
  createdAt?: string;
  /** Application token Id */
  id?: string;
  /** Application token spec */
  spec?: TokenSpec;
  /** Application token status */
  status?: TokenStatus;
  /** Application token update date */
  updatedAt?: string;
}
