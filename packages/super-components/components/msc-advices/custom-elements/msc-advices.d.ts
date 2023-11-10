import type { Components, JSX } from "../dist/types/components";

interface MscAdvices extends Components.MscAdvices, HTMLElement {}
export const MscAdvices: {
  prototype: MscAdvices;
  new (): MscAdvices;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
