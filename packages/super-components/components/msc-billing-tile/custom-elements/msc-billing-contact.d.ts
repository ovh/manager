import type { Components, JSX } from "../dist/types/components";

interface MscBillingContact extends Components.MscBillingContact, HTMLElement {}
export const MscBillingContact: {
  prototype: MscBillingContact;
  new (): MscBillingContact;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
