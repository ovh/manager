import { AppStateEnum } from '@/types/cloud/project/ai/app/AppStateEnum';

/** AI Solutions App State History Object */
export interface AppStateHistory {
  /** Date when the status occurred */
  date?: string;
  /** State of the app */
  state?: AppStateEnum;
}
