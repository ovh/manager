export const isLabeuEnvironment = (hostname: string = window.location.hostname): boolean =>
  /\.labeu\./.test(hostname);

export const isProdEnvironment = (hostname: string = window.location.hostname): boolean =>
  /(?:ca|us|eu)\.ovhcloud\.com/.test(hostname);
