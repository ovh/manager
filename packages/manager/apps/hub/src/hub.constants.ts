const BILLING_URL = /^\/billing\/.*/;

const USER_ACCOUNT_URL = /^\/useraccount\/.*/;

export const CATALOG_URL_REGEX = /^\/catalog(\/.)*/;

export const BILLING_REDIRECTIONS: RegExp[] = [BILLING_URL, USER_ACCOUNT_URL];

export default {
  BILLING_REDIRECTIONS,
  CATALOG_URL_REGEX,
};
