/**
 * Stable-name CMP loader (two-stage bootstrap: the loader fetches
 * `version.json` then injects the versioned bundle). Both hosts are CORS-open,
 * so the loader's cross-origin `version.json` fetch works from the
 * `manager.*.ovhcloud.com` origins (and from localhost in dev).
 */
export const CMP_LOADER_URLS = {
  production:
    'https://www.ovhcloud.com/website/session_handler/assets/cmp_app/cmp.iife.js',
  preproduction:
    'https://ovhcloudcom.static.ovh.net/website/session_handler/assets/cmp_app/cmp.iife.js',
};

/**
 * Production container hostnames (mirrors HOSTNAME_REGIONS in
 * @ovh-ux/manager-config). Anything else — localhost, CI, lab envs — declares
 * `preproduction` to the CMP (fail-closed: a misconfigured page never writes
 * consent to the production API).
 */
export const CMP_PROD_HOSTNAME_RE = /^manager\.(eu|ca|us)\.ovhcloud\.com$/;

/**
 * CustomEvent dispatched (synchronously) on `window` by the CMP bundle once
 * `window.__cmp` is registered and the page-load consent check has run.
 */
export const CMP_READY_EVENT = 'cmp:ready';

/**
 * Fail-safe delay for `cmp:ready`: if the loader never runs (URL unavailable,
 * blocked, crashed) the event never fires. Past this delay the CMP is flagged
 * as failed and the caller falls back to the legacy consent modal.
 */
export const CMP_READY_TIMEOUT_MS = 10000;
