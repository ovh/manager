export const isProdEnvironment = (
  hostname: string = window.location.hostname,
): boolean => /(?:ca|us|eu)\.ovhcloud\.com/.test(hostname);
