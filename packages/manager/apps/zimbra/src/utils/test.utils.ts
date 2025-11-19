export const odsTabIsSelected = (state: boolean) => `button[aria-selected=${state.toString()}]`;
export const odsTabById = (id: string) => `button[id="${id}"]`;
export const tabContent = (tabName: string) => `tab-content-${tabName}`;
export type OdsEvent = {
  emit: (Record) => void;
};
export type OdsHTMLElement = HTMLElement & {
  odsBlur: OdsEvent;
  odsChange: OdsEvent;
};
