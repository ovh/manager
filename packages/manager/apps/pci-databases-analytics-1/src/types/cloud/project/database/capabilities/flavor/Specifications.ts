import { UnitAndValueLong } from '@/types/complexType/UnitAndValueLong';

/** Cloud Database flavor specifications definition */
export interface Specifications {
  /** Flavor core number */
  core?: number;
  /** Flavor ram size */
  memory?: UnitAndValueLong;
  /** Flavor disk size */
  storage?: UnitAndValueLong;
}
