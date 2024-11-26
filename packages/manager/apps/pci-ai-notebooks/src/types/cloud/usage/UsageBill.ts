import { PaymentTypeEnum } from '@/types/cloud/usage/PaymentTypeEnum';

/** UsageBill */
export interface UsageBill {
  /** ID of the bill */
  bill_id?: string;
  /** Amount of credits used in this bill (not necessarily on part) */
  credit?: number;
  /** Amount of the bill that accounts for services for the usage period, credits not taken into account */
  part?: number;
  /** Payment type */
  payment_type?: PaymentTypeEnum;
  /** Total amount of the bill, credits not taken into account */
  total?: number;
}
