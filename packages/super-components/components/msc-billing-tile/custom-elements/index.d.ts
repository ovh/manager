/* MscBillingTile custom elements */
export { MenuCustom as MenuCustom } from '../dist/types/msc-billing-tile/menu-custom';
export { MscBillingCommitment as MscBillingCommitment } from '../dist/types/msc-billing-tile/msc-billing-commitment';
export { MscBillingContact as MscBillingContact } from '../dist/types/msc-billing-tile/msc-billing-contact';
export { MscBillingOffer as MscBillingOffer } from '../dist/types/msc-billing-tile/msc-billing-offer';
export { MscBillingRenewal as MscBillingRenewal } from '../dist/types/msc-billing-tile/msc-billing-renewal';
export { MscBillingTile as MscBillingTile } from '../dist/types/msc-billing-tile/msc-billing-tile';

/**
 * Used to manually set the base path where assets can be found.
 * If the script is used as "module", it's recommended to use "import.meta.url",
 * such as "setAssetPath(import.meta.url)". Other options include
 * "setAssetPath(document.currentScript.src)", or using a bundler's replace plugin to
 * dynamically set the path at build time, such as "setAssetPath(process.env.ASSET_PATH)".
 * But do note that this configuration depends on how your script is bundled, or lack of
 * bundling, and where your assets can be loaded from. Additionally custom bundling
 * will have to ensure the static assets are copied to its build directory.
 */
export declare const setAssetPath: (path: string) => void;

export interface SetPlatformOptions {
  raf?: (c: FrameRequestCallback) => number;
  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
}
export declare const setPlatformOptions: (opts: SetPlatformOptions) => void;
export * from '../dist/types';
