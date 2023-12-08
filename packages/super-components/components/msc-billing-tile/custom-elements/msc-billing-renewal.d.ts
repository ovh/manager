import type { Components, JSX } from "../dist/types/components";

interface MscBillingRenewal extends Components.MscBillingRenewal, HTMLElement {}
export const MscBillingRenewal: {
  prototype: MscBillingRenewal;
  new (): MscBillingRenewal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
