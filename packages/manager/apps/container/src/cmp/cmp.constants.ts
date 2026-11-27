/**
 * Stable-name CMP loader URLs (two-stage bootstrap: the loader fetches
 * `version.json` then injects the versioned bundle), provided at build time
 * through the `VITE_CMP_LOADER_URL` (production) and
 * `VITE_CMP_LOADER_URL_PREPROD` (everything else) environment variables.
 * Both values ship in the same build artifact — the same dist is deployed to
 * every environment — and the effective one is selected at runtime from the
 * hostname. When the selected variable is not provided, the CMP is considered
 * unavailable and the legacy consent modal takes over — a safe,
 * unchanged-behavior default.
 */
export const CMP_LOADER_URLS: Record<
  'production' | 'preproduction',
  string
> = {
  production: import.meta.env?.VITE_CMP_LOADER_URL ?? '',
  preproduction: import.meta.env?.VITE_CMP_LOADER_URL_PREPROD ?? '',
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
