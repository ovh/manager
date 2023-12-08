import type { Components, JSX } from "../dist/types/components";

interface MscTailLogs extends Components.MscTailLogs, HTMLElement {}
export const MscTailLogs: {
  prototype: MscTailLogs;
  new (): MscTailLogs;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
