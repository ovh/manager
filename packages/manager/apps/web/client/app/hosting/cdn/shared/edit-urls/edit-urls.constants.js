export const HTTP_PROTOCOLS = {
  HTTP: 'HTTP',
  HTTPS: 'HTTPS',
};

export const REGEX = {
  URL:
    '^http(s)?:\\/\\/((?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)?',
};

export const MAX_URL_ENTRIES = 100;

export default {
  HTTP_PROTOCOLS,
  REGEX,
  MAX_URL_ENTRIES,
};
