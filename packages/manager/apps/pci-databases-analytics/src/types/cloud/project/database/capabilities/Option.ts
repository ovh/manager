import { TypeEnum } from '@/types/cloud/project/database/TypeEnum';

/** Cloud Database option definition */
export interface Option {
  /** Name of the option */
  name?: string;
  /** Type of the option */
  type?: TypeEnum;
}
