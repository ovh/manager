export const odsTabIsSelected = (state: boolean) =>
  `ods-tab[is-selected=${state.toString()}]`;
export const odsTabById = (id: string) => `ods-tab[id="${id}"]`;
export const tabContent = (discriminator: string) =>
  `tab-content-${discriminator}`;
