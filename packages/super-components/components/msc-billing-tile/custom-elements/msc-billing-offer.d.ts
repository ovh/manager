import type { Components, JSX } from "../dist/types/components";

interface MscBillingOffer extends Components.MscBillingOffer, HTMLElement {}
export const MscBillingOffer: {
  prototype: MscBillingOffer;
  new (): MscBillingOffer;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
