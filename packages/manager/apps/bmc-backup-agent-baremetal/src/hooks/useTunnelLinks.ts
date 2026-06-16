import { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const SUBSIDIARY_TO_DOCS_LANG: Record<string, string> = {
  FR: 'fr',
  QC: 'fr',
  MA: 'fr',
  SN: 'fr',
  TN: 'fr',
  DE: 'de',
  ES: 'es',
  WS: 'es',
  IT: 'it',
  PL: 'pl',
  PT: 'pt',
};

const SUBSIDIARY_TO_OVHCLOUD_LOCALE: Record<string, string> = {
  ASIA: 'asia',
  AU: 'en-au',
  CA: 'en-ca',
  CZ: 'en-ie',
  DE: 'de',
  ES: 'es-es',
  FI: 'en-ie',
  FR: 'fr',
  GB: 'en-gb',
  IE: 'en-ie',
  IN: 'en-in',
  IT: 'it',
  LT: 'en-ie',
  MA: 'fr-ma',
  NL: 'nl',
  PL: 'pl',
  PT: 'pt',
  QC: 'fr-ca',
  SG: 'en-sg',
  SN: 'fr-sn',
  TN: 'fr-tn',
  US: 'en',
  WE: 'en',
  WS: 'es',
};

const DOCS_BASE = 'https://docs.ovhcloud.com';
const AGENT_DOCS_PATH = 'guides/storage-and-backup/backup-agent';
const OVHCLOUD_BASE = 'https://www.ovhcloud.com';

function getDocsLang(ovhSubsidiary: string): string {
  return SUBSIDIARY_TO_DOCS_LANG[ovhSubsidiary] ?? 'en';
}

function getOvhcloudLocale(ovhSubsidiary: string): string {
  return SUBSIDIARY_TO_OVHCLOUD_LOCALE[ovhSubsidiary] ?? 'en';
}

export function useTunnelLinks() {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const lang = getDocsLang(ovhSubsidiary);
  const locale = getOvhcloudLocale(ovhSubsidiary);
  const docsBase = `${DOCS_BASE}/${lang}/${AGENT_DOCS_PATH}`;
  const ovhBase = `${OVHCLOUD_BASE}/${locale}`;

  return {
    faq: `${docsBase}/troubleshooting`,
    installGuide: `${docsBase}/first-configuration`,
    orderBaremetal: `${ovhBase}/bare-metal/`,
    support: `${ovhBase}/support-levels/`,
    paymentSettings: 'https://www.ovh.com/manager/#/dedicated/billing/payment/method',
  } as const;
}
