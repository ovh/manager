import { Quantity } from '@/types/cloud/billingView/Quantity';

/** Component */
export interface Component {
  /** Name of the component */
  name?: string;
  /** Total quantity for the component */
  quantity?: Quantity;
  /** Total price for this component */
  totalPrice?: number;
}
