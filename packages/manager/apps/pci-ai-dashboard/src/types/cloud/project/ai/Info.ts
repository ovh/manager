import { InfoCodeEnum } from '@/types/cloud/project/ai/InfoCodeEnum';

/** Information about the state of this entity */
export interface Info {
  /** Info code identifier */
  code?: InfoCodeEnum;
  /** Formatted message */
  message?: string;
}
