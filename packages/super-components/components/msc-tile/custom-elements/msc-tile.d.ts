import type { Components, JSX } from "../dist/types/components";

interface MscTile extends Components.MscTile, HTMLElement {}
export const MscTile: {
  prototype: MscTile;
  new (): MscTile;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
