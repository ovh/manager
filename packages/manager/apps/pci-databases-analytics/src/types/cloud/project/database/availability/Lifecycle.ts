import { StatusEnum } from '@/types/cloud/project/database/availability/StatusEnum';

/** Availability of databases engines on cloud projects */
export interface Lifecycle {
  /** End of life of the product */
  endOfLife?: string;
  /** End of sale of the product */
  endOfSale?: string;
  /** Date of the release of the product */
  startDate?: string;
  /** Status of the availability */
  status?: StatusEnum;
}
