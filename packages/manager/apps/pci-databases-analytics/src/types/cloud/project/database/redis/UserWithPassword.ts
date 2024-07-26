import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** Redis user with password definition */
export interface UserWithPassword {
  /** Categories of the user */
  categories?: string[];
  /** Channels of the user */
  channels?: string[];
  /** Commands of the user */
  commands?: string[];
  /** Date of the creation of the user */
  createdAt?: string;
  /** User ID */
  id?: string;
  /** Keys of the user */
  keys?: string[];
  /** Password of the user */
  password?: string;
  /** Current status of the user */
  status?: StatusEnum;
  /** Name of the user */
  username?: string;
}
