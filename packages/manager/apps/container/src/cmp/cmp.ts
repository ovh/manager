import {
  CMP_LOADER_URLS,
  CMP_PROD_HOSTNAME_RE,
  CMP_READY_EVENT,
  CMP_READY_TIMEOUT_MS,
} from './cmp.constants';

/**
 * CMP facade — loads the OVHcloud Consent Management Platform and wraps its
 * `window.__cmp` API.
 *
 * The container is the host-page side of the CMP contract: it DECLARES the
 * page context in `window.__cmpConfig` (locale / region / environment) and
 * injects the stable-name loader; the CMP does the rest (consent banner,
 * preferences modal, `cmp_consent` cookie). Consent is then applied to the
 * shell tracking plugin by the CookiePolicy bridge.
 *
 * `scripts` is intentionally empty: the Manager V6 tracking SDK (Piano) is
 * bundled and consent-gated in the tracking plugin — the CMP owns the consent
 * UI and cookie only, it injects no tag container in this app.
 *
 * Failure posture: the `cmp:ready` listener is armed before the loader is
 * injected (the CMP dispatches it synchronously), the loader carries an
 * `onerror`, and `cmp:ready` is time-bounded. Every promise resolves —
 * `isError()` carries the diagnosis so the caller can fall back to the legacy
 * consent modal.
 */

export type CmpChoices = Record<string, boolean>;

export type CmpApi = (command: string, ...args: unknown[]) => unknown;

export interface CmpRuntimeConfig {
  /** UI locale, BCP-47 (e.g. `"fr-FR"`). */
  locale: string;
  region: 'EU' | 'CA';
  environment: 'production' | 'preproduction';
  /** Script URLs the CMP injects — always empty in the Manager V6. */
  scripts: string[];
}

interface CmpWindow {
  __cmpConfig?: CmpRuntimeConfig;
  __cmp?: CmpApi;
}

export interface CmpLoadParams {
  /** Manager locale, snake_case (e.g. `"fr_FR"`) — converted to BCP-47. */
  locale: string;
  region: 'EU' | 'CA';
}

export type InjectScript = (src: string, onError: () => void) => void;

export interface Cmp {
  /**
   * Declares `window.__cmpConfig` then injects the CMP loader. Idempotent,
   * never throws, no-op outside the DOM. Only called for EU/CA regions.
   */
  load(params: CmpLoadParams): void;
  /**
   * Resolves once `window.__cmp` is available (on `cmp:ready`, with a
   * synchronous short-circuit when already up). Always resolves — after
   * {@link CMP_READY_TIMEOUT_MS} the CMP is flagged as failed instead.
   */
  whenReady(): Promise<void>;
  /** Whether the CMP failed to come up (loader error / ready timeout). */
  isError(): boolean;
  /** Current choices per category, or `null` (CMP not up / no consent yet). */
  getConsent(): CmpChoices | null;
  /**
   * Subscribes to consent changes (collected / updated / withdrawn). Safe to
   * call before the CMP is up — armed on `cmp:ready`.
   */
  onConsentChange(callback: (choices: CmpChoices) => void): () => void;
  /** Opens the CMP preferences modal (queued until the CMP is up). */
  showPreferences(): void;
}

const defaultInjectScript: InjectScript = (src, onError) => {
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.onerror = onError;
  (document.head || document.body).appendChild(script);
};

const toBcp47 = (locale: string): string => locale.replace('_', '-');

export function createCmp(deps: { injectScript?: InjectScript } = {}): Cmp {
  const injectScript = deps.injectScript ?? defaultInjectScript;

  let loaded = false;
  let failed = false;
  let readyPromise: Promise<void> | null = null;
  let settleReady: (() => void) | null = null;

  const win = (): CmpWindow => (window as unknown) as CmpWindow;

  const isApiReady = (): boolean => typeof win().__cmp === 'function';

  /** Flags the CMP as failed and unblocks anything awaiting `cmp:ready`. */
  const markFailed = (): void => {
    failed = true;
    if (settleReady) settleReady();
  };

  const whenReady = (): Promise<void> => {
    if (!readyPromise) {
      readyPromise = new Promise<void>((resolve) => {
        if (typeof window === 'undefined' || failed || isApiReady()) {
          resolve();
          return;
        }
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          settleReady = null;
          resolve();
        };
        settleReady = settle;
        window.addEventListener(CMP_READY_EVENT, settle, { once: true });
        // Fail-safe: cmp:ready may never fire (loader unavailable/blocked).
        setTimeout(() => {
          if (!settled && !isApiReady()) failed = true;
          settle();
        }, CMP_READY_TIMEOUT_MS);
      });
    }
    return readyPromise;
  };

  const load = ({ locale, region }: CmpLoadParams): void => {
    if (loaded || typeof document === 'undefined') return;
    loaded = true;

    // Arm the cmp:ready listener BEFORE injecting the loader: the CMP
    // dispatches it synchronously as soon as its bundle runs.
    whenReady();

    const environment = CMP_PROD_HOSTNAME_RE.test(window.location.hostname)
      ? 'production'
      : 'preproduction';

    // Must be set BEFORE the bundle loads (read once at module-init).
    win().__cmpConfig = {
      locale: toBcp47(locale),
      region,
      environment,
      scripts: [],
    };

    injectScript(CMP_LOADER_URLS[environment], markFailed);
  };

  const getConsent = (): CmpChoices | null => {
    const api = win().__cmp;
    if (typeof api !== 'function') return null;
    return (api('getConsent') as CmpChoices | null) ?? null;
  };

  const onConsentChange = (
    callback: (choices: CmpChoices) => void,
  ): (() => void) => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;
    whenReady().then(() => {
      if (cancelled) return;
      const api = win().__cmp;
      if (typeof api !== 'function') return;
      const result = api('onConsentChange', callback);
      if (typeof result === 'function') unsubscribe = result as () => void;
    });
    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  };

  const showPreferences = (): void => {
    whenReady().then(() => {
      const api = win().__cmp;
      if (typeof api === 'function') api('showPreferences');
    });
  };

  return {
    load,
    whenReady,
    isError: () => failed,
    getConsent,
    onConsentChange,
    showPreferences,
  };
}

/** Container-wide singleton — the CookiePolicy bridge is the only driver. */
export const cmp = createCmp();
