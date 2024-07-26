import { StatusEnum } from '@/types/cloud/project/database/StatusEnum';

/** Redis user definition */
export interface User {
  /** Categories of the user */
  categories: string[];
  /** Channels of the user */
  channels: string[];
  /** Commands of the user */
  commands: string[];
  /** Date of the creation of the user */
  createdAt?: string;
  /** User ID */
  id?: string;
  /** Keys of the user */
  keys: string[];
  /** Current status of the user */
  status?: StatusEnum;
  /** Name of the user */
  username?: string;
}
