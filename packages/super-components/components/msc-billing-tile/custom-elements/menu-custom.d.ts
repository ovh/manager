import type { Components, JSX } from "../dist/types/components";

interface MenuCustom extends Components.MenuCustom, HTMLElement {}
export const MenuCustom: {
  prototype: MenuCustom;
  new (): MenuCustom;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
