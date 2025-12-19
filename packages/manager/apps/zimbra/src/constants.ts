export const FEATURE_AVAILABILITY = {
  PRO_BETA: 'zimbra:pro_beta',
};

export const OVH_WEBSITE_ROOT_URL = 'https://ovhcloud.com';

export const ZimbraLabsLink = 'https://labs.ovhcloud.com/en/zimbra-beta/';

export const MAX_STARTER_STORAGE_QUOTA = 16106127360;
export const MAX_PRO_STORAGE_QUOTA = 53687091200;

export const ZimbraEmailsLink: Record<string, string> = {
  DEFAULT: `${OVH_WEBSITE_ROOT_URL}/en-ie/emails/zimbra-emails/`,
  FR: `${OVH_WEBSITE_ROOT_URL}/fr/emails/zimbra-emails/`,
  GB: `${OVH_WEBSITE_ROOT_URL}/en-gb/emails/zimbra-emails/`,
  DE: `${OVH_WEBSITE_ROOT_URL}/de/emails/zimbra-emails/`,
  ES: `${OVH_WEBSITE_ROOT_URL}/es-es/emails/zimbra-emails/`,
  IT: `${OVH_WEBSITE_ROOT_URL}/it/emails/zimbra-emails/`,
  PL: `${OVH_WEBSITE_ROOT_URL}/pl/emails/zimbra-emails/`,
  PT: `${OVH_WEBSITE_ROOT_URL}/pt/emails/zimbra-emails/`,
  IE: `${OVH_WEBSITE_ROOT_URL}/en-ie/emails/zimbra-emails/`,
  MA: `${OVH_WEBSITE_ROOT_URL}/fr-ma/emails/zimbra-emails/`,
  TN: `${OVH_WEBSITE_ROOT_URL}/fr-tn/emails/zimbra-emails/`,
  SN: `${OVH_WEBSITE_ROOT_URL}/fr-sn/emails/zimbra-emails/`,
};

export const starterFeatures = [
  { label: 'zimbra_account_plan_feature_storage_starter' },
  {
    label: 'zimbra_account_plan_feature_share_starter',
    tooltip: 'zimbra_account_plan_feature_share_starter_tooltip',
  },
];

export const proFeatures = [
  { label: 'zimbra_account_plan_feature_storage_pro' },
  { label: 'zimbra_account_plan_feature_share_pro' },
  {
    label: 'zimbra_account_plan_feature_sync',
    tooltip: 'zimbra_account_plan_feature_sync_tooltip',
  },
  { label: 'zimbra_account_plan_feature_files_storage' },
  { label: 'zimbra_account_plan_feature_co_edit' },
  { label: 'zimbra_account_plan_feature_private_chat' },
];

export const businessFeatures = [
  ...proFeatures,
  { label: 'zimbra_account_plan_feature_team_chat' },
  { label: 'zimbra_account_plan_feature_shared_storage' },
  { label: 'zimbra_account_plan_feature_video_conferences' },
];

export const MAX_REDIRECTIONS_QUOTA = 1000;
