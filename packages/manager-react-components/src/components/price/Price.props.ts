import { IntervalUnitType, OvhSubsidiary } from '../../enumTypes';

export type PriceProps = {
  /** The price value to display */
  value: number;
  /** The tax value to display */
  tax?: number;
  /** The interval unit for the price (day, month, year) */
  intervalUnit?: IntervalUnitType;
  /** The OVH subsidiary to determine price format */
  ovhSubsidiary: OvhSubsidiary;
  /** Whether to convert the price based on interval unit */
  isConvertIntervalUnit?: boolean;
  /** The locale for price formatting */
  locale: string;
};
