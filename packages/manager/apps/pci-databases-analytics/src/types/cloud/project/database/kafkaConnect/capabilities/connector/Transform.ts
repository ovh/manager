import { TypeEnum } from '@/types/cloud/project/database/kafkaConnect/connector/property/TypeEnum';

/** KafkaConnect connector transform definition */
export interface Transform {
  /** Description of the transform */
  description?: string;
  /** Pretty name of the transform */
  displayName?: string;
  /** Name of the transform */
  name?: string;
  /** Defines whether the transform is required */
  required?: boolean;
  /** Transform type this transform relates to */
  transformType?: string;
  /** Type of data of the transform */
  type?: TypeEnum;
  /** Possible values for the transform if applicable */
  values?: string[];
}
