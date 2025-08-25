export const odsTabIsSelected = (state: boolean) => `ods-tab[is-selected=${state.toString()}]`;
export const odsTabById = (id: string) => `ods-tab[id="${id}"]`;
export const tabContent = (discriminator: string) => `tab-content-${discriminator}`;
export type OdsEvent = {
  emit: (Record) => void;
};
export type OdsHTMLElement = HTMLElement & {
  odsBlur: OdsEvent;
  odsChange: OdsEvent;
};
