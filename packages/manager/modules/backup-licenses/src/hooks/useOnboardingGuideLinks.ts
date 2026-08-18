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

const DOCS_BASE = 'https://docs.ovhcloud.com';
const BACKUP_LICENSES_DOCS_PATH = 'guides/storage-and-backup/backup-licenses';

function getDocsLang(ovhSubsidiary: string): string {
  return SUBSIDIARY_TO_DOCS_LANG[ovhSubsidiary] ?? 'en';
}

export const useOnboardingGuideLinks = () => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const docsBase = `${DOCS_BASE}/${getDocsLang(ovhSubsidiary)}/${BACKUP_LICENSES_DOCS_PATH}`;

  return {
    firstConfiguration: `${docsBase}/first-configuration`,
    migrationVeeamEnterprise: `${docsBase}/migration-veeam-enterprise`,
  } as const;
};
