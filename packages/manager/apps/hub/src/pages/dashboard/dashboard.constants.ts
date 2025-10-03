export const BILLING_FEATURE = 'billing:management';
export const SIRET_BANNER_FEATURE = 'hub:banner-hub-invite-customer-siret';
export const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';
export const KYC_INDIA_FEATURE = 'identity-documents';
export const KYC_FRAUD_FEATURE = 'procedures:fraud';

export const features = [
  BILLING_FEATURE,
  SIRET_BANNER_FEATURE,
  SIRET_MODAL_FEATURE,
  KYC_INDIA_FEATURE,
  KYC_FRAUD_FEATURE,
];

export const BILLING_SUMMARY_PERIODS_IN_MONTHS = [1, 3, 6];

export const LINK = 'https://billing.us.ovhcloud.com/login';

export const NOTIFICATIONS_LINKS = {
  GLOBAL_COMMUNICATION_PHISHING: {
    DE: 'https://help.ovhcloud.com/csm/de-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0030035',
    ES: 'https://help.ovhcloud.com/csm/es-es-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043067',
    IE: 'https://help.ovhcloud.com/csm/en-ie-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043341',
    IT: 'https://help.ovhcloud.com/csm/it-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043072',
    PL: 'https://help.ovhcloud.com/csm/pl-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043071',
    PT: 'https://help.ovhcloud.com/csm/pt-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043070',
    FR: 'https://help.ovhcloud.com/csm/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069',
    MA: 'https://help.ovhcloud.com/csm/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069',
    SN: 'https://help.ovhcloud.com/csm/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069',
    TN: 'https://help.ovhcloud.com/csm/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069',
    NL: 'https://help.ovhcloud.com/csm/en-nl-documentation-account-and-service-management?id=kb_browse_cat&kb_id=7c798fe1551974502d4c6e78b74219bb',
    GB: 'https://help.ovhcloud.com/csm/en-gb-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043064',
    CA: 'https://help.ovhcloud.com/csm/en-ca-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043351',
    QC: 'https://help.ovhcloud.com/csm/fr-ca-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043068',
    IN: 'https://help.ovhcloud.com/csm/asia-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043063',
    SG: 'https://help.ovhcloud.com/csm/en-sg-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043062',
    ASIA: 'https://help.ovhcloud.com/csm/asia-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043063',
    US: 'https://support.us.ovhcloud.com/hc/en-us/articles/28330641929491-VMware-Cloud-Director-How-to-Use-the-vCD-User-Interface',
  },
};

export const KYC_FRAUD_TRACK_IMPRESSION = {
  campaignId: 'kyc-fraud',
  creation: 'notification',
  format: 'banner',
  generalPlacement: 'manager-hub',
};

export const USER_CERTIFICATES = {
  EMAIL_UNREACHABLE: 'email-unreachable',
} as const;

export default {
  features,
  BILLING_SUMMARY_PERIODS_IN_MONTHS,
  LINK,
  NOTIFICATIONS_LINKS,
};
