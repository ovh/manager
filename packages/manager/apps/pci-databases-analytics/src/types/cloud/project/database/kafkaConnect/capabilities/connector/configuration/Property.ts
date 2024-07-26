import { ImportanceEnum } from '@/types/cloud/project/database/kafkaConnect/capabilities/connector/property/ImportanceEnum';
import { TypeEnum } from '@/types/cloud/project/database/kafkaConnect/connector/property/TypeEnum';

/** KafkaConnect connector config property definition */
export interface Property {
  /** Defines the default value is exists */
  defaultValue?: string;
  /** Description of the property */
  description?: string;
  /** Pretty name of the property */
  displayName?: string;
  /** Group to which belongs the property */
  group?: string;
  /** Importance of the property */
  importance?: ImportanceEnum;
  /** Name of the property */
  name?: string;
  /** Defines whether the property is required */
  required?: boolean;
  /** Type of data of the property */
  type?: TypeEnum;
  /** Possible values for the property if string and applicable */
  values?: string[];
}
