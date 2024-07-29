import { LogLine } from '@/types/cloud/project/ai/LogLine';

/** Instance Logs */
export interface Logs {
  /** Last activity date */
  lastActivity?: string;
  /** Logs lines */
  logs?: LogLine[];
}
