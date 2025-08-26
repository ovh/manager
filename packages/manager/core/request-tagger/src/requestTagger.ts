declare global {
  interface Window {
    ovhRequestTaggerNavigationId?: string;
    ovhRequestTaggerRequestIndex?: number;
    ovhRequestTaggerApplicationVersion?: string;
  }
}

export enum Header {
  NAVIGATION_ID = 'X-OVH-MANAGER-NAVIGATION-ID',
  REQUEST_ID = 'X-OVH-MANAGER-REQUEST-ID',
  PAGE = 'X-OVH-MANAGER-PAGE',
  VERSION = 'X-OVH-MANAGER-VERSION',
}

export interface Headers {
  [Header.NAVIGATION_ID]: string;
  [Header.REQUEST_ID]: string;
  [Header.PAGE]: string;
  [Header.VERSION]?: string;
}

export interface HeadersOverrides {
  [key: string]: Partial<Headers>;
}

export const ROUTES_PREFIX = ['/engine/apiv6', '/engine/2api', '/engine/api/v2'];
export const DEFAULT_ROUTES_HEADERS_OVERRIDE: HeadersOverrides = {};

let currentPage = 'bootstrap';
const headersOverride: HeadersOverrides = DEFAULT_ROUTES_HEADERS_OVERRIDE;

export const generateNavigationId = (): string => {
  if (window.top) {
    window.top.ovhRequestTaggerNavigationId = Date.now().toString(36);
    return window.top.ovhRequestTaggerNavigationId;
  }
  const fallbackId = Date.now().toString(36);
  window.ovhRequestTaggerNavigationId = fallbackId;
  return fallbackId;
};

export const getNavigationId = (): string => {
  if (!window?.top?.ovhRequestTaggerNavigationId) return generateNavigationId();
  return window.top.ovhRequestTaggerNavigationId;
};

export const defineApplicationVersion = (version: string): void => {
  window.ovhRequestTaggerApplicationVersion = version;
};

export const getApplicationVersion = (): string | undefined =>
  window?.ovhRequestTaggerApplicationVersion;

export const generateRequestId = (): string => {
  if (window.top) {
    window.top.ovhRequestTaggerRequestIndex = window.top.ovhRequestTaggerRequestIndex ?? 0;
    window.top.ovhRequestTaggerRequestIndex += 1;

    return `${Date.now()}-${window.top.ovhRequestTaggerRequestIndex}`;
  }

  // fallback if no top window
  window.ovhRequestTaggerRequestIndex = (window.ovhRequestTaggerRequestIndex ?? 0) + 1;

  return `${Date.now()}-${window.ovhRequestTaggerRequestIndex}`;
};

export const defineCurrentPage = (page: string): void => {
  currentPage = page;
};

export const addHeadersOverride = (
  pattern: string,
  headers: Partial<Headers>,
): HeadersOverrides => {
  headersOverride[pattern] = headers;
  return headersOverride;
};

export const removeHeadersOverride = (pattern: string): HeadersOverrides => {
  delete headersOverride[pattern];
  return headersOverride;
};

export const getHeadersOverride = (): HeadersOverrides => headersOverride;

export const isURLValid = (url: string): boolean => {
  return ROUTES_PREFIX.some((prefix) => url?.startsWith(prefix));
};

export const searchHeadersOverride = (url: string): Partial<Headers> => {
  const overridesKey = Object.keys(headersOverride).find((routePattern) =>
    new RegExp(routePattern).test(url),
  );
  if (overridesKey && headersOverride[overridesKey]) {
    return headersOverride[overridesKey];
  }
  return {};
};

export const getHeaders = (url: string): Partial<Headers> => {
  if (isURLValid(url)) {
    return {
      [Header.NAVIGATION_ID]: getNavigationId(),
      [Header.REQUEST_ID]: generateRequestId(),
      [Header.PAGE]: currentPage,
      ...(window.ovhRequestTaggerApplicationVersion
        ? { [Header.VERSION]: window.ovhRequestTaggerApplicationVersion }
        : {}),
      ...searchHeadersOverride(url),
    };
  }
  return {};
};
