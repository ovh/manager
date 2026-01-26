import { CountryCode } from '@ovh-ux/manager-config';

export const LABELS = {
  BACKUP_AGENT: 'Backup Agent',
  BACKUP_POLICY: 'Backup Policy',
  TENANTS: 'Tenants',
  VAULTS: 'Vaults',
  TENANT: 'Tenant',
  VAULT: 'Vault',
} as const;

export const FEATURE_AVAILABILITY = Object.freeze({
  DELETE_TENANT: 'deleteTenant',
  DELETE_VAULT: 'deleteVault',
});

export const OS_LABELS = {
  LINUX: 'Linux',
  WINDOWS: 'Windows',
};

export const VAULT_PLAN_CODE = 'backup-vault-paygo-consumption';

export const BACKUP_AGENT_IAM_RULES = {
  'vault/edit': 'backupServices:apiovh:vault/edit',
  'vspc/edit': 'backupServices:apiovh:vspc/edit',
  'vspc/attach': 'backupServices:apiovh:vault/attach',
};

const getGuideAgentConfigurationUrl = ([language, article]: string[]) =>
  `https://help.ovhcloud.com/csm/${language}-backup-agent-first-configuration?id=kb_article_view&sysparm_article=${article}`;

type GuideLinks = Partial<{ [key in CountryCode | 'DEFAULT']?: string }>;

const frParams = ['fr', 'KB0074361'];
const enIeParams = ['en-ie', 'KB0074354'];

export const GUIDE_AGENT_CONGURATION_PARAMS: GuideLinks = {
  DE: getGuideAgentConfigurationUrl(['de', 'KB0074350']),
  ES: getGuideAgentConfigurationUrl(['es-es', 'KB0074355']),
  FR: getGuideAgentConfigurationUrl(frParams),
  IE: getGuideAgentConfigurationUrl(enIeParams),
  IT: getGuideAgentConfigurationUrl(['it', 'KB0074365']),
  PL: getGuideAgentConfigurationUrl(['pl', 'KB0074358']),
  PT: getGuideAgentConfigurationUrl(['pt', 'KB0074369']),
  GB: getGuideAgentConfigurationUrl(['en-gb', 'KB0074353']),
  MA: getGuideAgentConfigurationUrl(frParams),
  SN: getGuideAgentConfigurationUrl(frParams),
  TN: getGuideAgentConfigurationUrl(frParams),
  NL: getGuideAgentConfigurationUrl(enIeParams),
  CA: getGuideAgentConfigurationUrl(['en-ca', 'KB0074360']),
  QC: getGuideAgentConfigurationUrl(['fr-ca', 'KB0074363']),
  AU: getGuideAgentConfigurationUrl(['en-au', 'KB0074352']),
  ASIA: getGuideAgentConfigurationUrl(['en-sg', 'KB0074356']),
  WE: getGuideAgentConfigurationUrl(enIeParams),
  WS: getGuideAgentConfigurationUrl(enIeParams),
  DEFAULT: getGuideAgentConfigurationUrl(enIeParams),
};
