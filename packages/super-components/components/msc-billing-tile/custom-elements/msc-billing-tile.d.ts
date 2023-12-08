import type { Components, JSX } from "../dist/types/components";

interface MscBillingTile extends Components.MscBillingTile, HTMLElement {}
export const MscBillingTile: {
  prototype: MscBillingTile;
  new (): MscBillingTile;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
