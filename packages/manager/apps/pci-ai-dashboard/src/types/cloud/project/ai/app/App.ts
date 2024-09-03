import { AppSpec } from '@/types/cloud/project/ai/app/AppSpec';
import { AppStatus } from '@/types/cloud/project/ai/app/AppStatus';

/** AI Solutions Platform App Object */
export interface App {
  /** App creation date */
  createdAt?: string;
  /** App Id */
  id?: string;
  /** App spec */
  spec?: AppSpec;
  /** App Container Status */
  status?: AppStatus;
  /** App last update date */
  updatedAt?: string;
  /** App user owner */
  user?: string;
}
