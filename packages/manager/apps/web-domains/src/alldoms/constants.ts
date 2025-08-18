const URL_SUFFIX = 'cgi-bin/order/renew.cgi?domainChooser=';

export const RENEW_URL: Record<string, string> = {
  DEFAULT: `https://www.ovh.com/${URL_SUFFIX}`,
  AU: `https://ca.ovh.com/au/${URL_SUFFIX}`,
  CA: `https://ca.ovh.com/fr/${URL_SUFFIX}`,
  SG: `https://ca.ovh.com/sg/${URL_SUFFIX}`,
  QC: `https://ca.ovh.com/fr/${URL_SUFFIX}`,
  WE: `https://ca.ovh.com/fr/${URL_SUFFIX}`,
  CZ: `https://www.ovh.cz/${URL_SUFFIX}`,
  DE: `https://www.ovh.de/${URL_SUFFIX}`,
  EN: `https://www.ovh.co.uk/${URL_SUFFIX}`,
  ES: `https://www.ovh.es/${URL_SUFFIX}`,
  FI: `https://www.ovh-hosting.fi/${URL_SUFFIX}`,
  FR: `https://eu.ovh.com/fr/${URL_SUFFIX}`,
  GB: `https://www.ovh.co.uk/${URL_SUFFIX}`,
  IE: `https://www.ovh.ie/${URL_SUFFIX}`,
  IT: `https://www.ovh.it/${URL_SUFFIX}`,
  LT: `https://www.ovh.lt/${URL_SUFFIX}`,
  MA: `https://www.ovh.com/ma/${URL_SUFFIX}`,
  NL: `https://www.ovh.nl/${URL_SUFFIX}`,
  PL: `https://www.ovh.pl/${URL_SUFFIX}`,
  PT: `https://www.ovh.pt/${URL_SUFFIX}`,
  RU: `https://www.ovh.co.uk/${URL_SUFFIX}`,
  SN: `https://www.ovh.sn/${URL_SUFFIX}`,
  TN: `https://www.ovh.com/tn/${URL_SUFFIX}`,
};

export const allDomManagerService = 'ALL_DOM';

export const TERMINATE_URL = (serviceName?: string) =>
  serviceName ? `terminate/${serviceName}` : 'terminate';
export const CANCEL_TERMINATE_URL = (serviceName?: string) =>
  serviceName ? `terminate/cancel/${serviceName}` : 'terminate/cancel';
