import { UnitAndValueLong } from '@/types/complexType/UnitAndValueLong';

/** Defines the storage attributes of a service */
export interface Storage {
  /** Service storage size */
  size: UnitAndValueLong;
  /** Service storage type */
  type?: string;
}
