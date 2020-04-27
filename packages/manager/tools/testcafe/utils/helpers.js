/* eslint-disable no-undef */
import { ClientFunction } from 'testcafe';

/**
 * Simply hide an element.
 */
export async function hideElement(element) {
  return ClientFunction((selector, styleValue) => {
    const el = selector();
    el.setAttribute('style', styleValue);
  })(element, 'none');
}

/**
 * Get page URL.
 */
export async function getPageUrl() {
  return ClientFunction(() => window.location.href)();
}
