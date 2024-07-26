import { UnitAndValueLong } from '@/types/complexType/UnitAndValueLong';

/** Specifications of the storage for availabilities of databases engines on cloud projects */
export interface Storage {
  /** Maximum storage of the availability */
  maximum?: UnitAndValueLong;
  /** Minimum storage of the availability */
  minimum?: UnitAndValueLong;
  /** Memory step that can be added between minimum and maximum */
  step?: UnitAndValueLong;
}
