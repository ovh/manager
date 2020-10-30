export const BACKUP_PROPERTIES = [
  'backupDurationInReport',
  'backupSizeInReport',
  'diskSizeInReport',
  'fullDayInReport',
  'restorePointInReport',
  'backupOffer',
];

export const BACKUP_PROPERTIES_MAP = {
  classic: BACKUP_PROPERTIES,
  advanced: [...BACKUP_PROPERTIES, 'mailAddress'],
  premium: [...BACKUP_PROPERTIES, 'mailAddress'],
};

export const BACKUP_MINIMUM_HOST_COUNT = 2;

export const BACKUP_GUIDES_URL = {
  CA: {
    fr_FR: 'https://docs.ovh.com/fr/storage/veeam-backup-replication',
    fr_CA: 'https://docs.ovh.com/fr/storage/veeam-backup-replication',
    default:
      'https://docs.ovh.com/gb/en/private-cloud/veeam-backup-as-a-service/',
  },
  EU: {
    fr_FR: 'https://docs.ovh.com/fr/storage/veeam-backup-replication',
    default:
      'https://docs.ovh.com/gb/en/private-cloud/veeam-backup-as-a-service/',
  },
  US: {
    default: 'https://support.us.ovhcloud.com/hc/en-us/articles/360013652139',
  },
};

export const BACKUP_OFFER_NAME = {
  advanced: 'Advanced',
  classic: 'Standard',
  premium: 'Premium',
};

export const BACKUP_OFFER_LEGACY = 'legacy';
export const BACKUP_OFFER_PREMIUM = 'premium';
export const BACKUP_OFFER_ADVANCED = 'advanced';
export const BACKUP_OFFER_CLASSIC = 'classic';

export const BACKUP_STATE_DISABLED = 'disabled';
export const BACKUP_STATE_ENABLING = 'enabling';
export const BACKUP_STATE_REMOVING = 'removing';
export const BACKUP_STATE_ENABLED = 'enabled';

export const CATALOG_INFO = {
  ADDON_FAMILY_NAME: 'backup',
  ADDON_PLAN_CODE: 'pcc-option-backup-managed',
  ADDON_BACKUP_JOB_OFFER_FAMILY_NAME: 'backupjob-offer',
};

export const BACKUP_CONDITIONS_URL = {
  ASIA:
    'https://www.ovh.com/asia/support/termsofservice/Specific_Conditions_public_cloud%20(Asia)_18022019.pdf',
  AU:
    'https://www.ovh.com.au/support/termsofservice/Special_Conditions_for_Private_Cloud.pdf',
  CA:
    'https://www.ovh.com/ca/en/support/termsofservice/special_conditions_dedicated_cloud_2014.pdf',
  CZ:
    'https://www.ovh.ie/support/termsofservice/Special_Conditions_for_Dedicated_Cloud_2014.pdf',
  DE: 'https://www.ovh.de/support/agb/OVH_Anlage_Dedicated_Cloud.pdf',
  ES:
    'https://www.ovh.es/soporte/documentos_legales/Condiciones_particulares_Dedicated_Cloud_2014.pdf',
  FI:
    'https://www.ovh.ie/support/termsofservice/Special_Conditions_for_Dedicated_Cloud_2014.pdf',
  FR:
    'https://www.ovh.com/fr/support/documents_legaux/conditions_particulieres_dedicated_cloud_2014.pdf',
  GB:
    'https://www.ovh.co.uk/support/termsofservice/Special_Conditions_for_Dedicated_Cloud_2014.pdf',
  IE:
    'https://www.ovh.ie/support/termsofservice/Special_Conditions_for_Dedicated_Cloud_2014.pdf',
  IT:
    'https://www.ovh.it/supporto/documenti_legali/condizioni_particolari_dell_offerta_dedicated_cloud_2014.pdf',
  LT:
    'https://www.ovh.ie/support/termsofservice/Special_Conditions_for_Dedicated_Cloud_2014.pdf',
  MA:
    'https://www.ovh.com/ma/support/documents_legaux/conditions_particulieres_dedicated_cloud_2014.pdf',
  NL:
    'https://www.ovh.nl/support/algemene_voorwaarden/Bijzondere_%20Voorwaarden_voor_Dedicated_Cloud_%202014.pdf',
  PL:
    'https://www.ovh.pl/pomoc/dokumenty/Szczegolowe_warunki_korzystania_Dedicated_Cloud_2014.pdf',
  PT:
    'https://www.ovh.pt/suporte/documentos_legais/condicoes_particulares_dedicated_cloud_2014.pdf',
  QC:
    'https://www.ovh.com/ca/fr/support/documents_legaux/conditions_particulieres_cloud_dedie_2014.pdf',
  SG:
    'https://www.ovh.sn/support/documents_legaux/conditions_particulieres_dedicated_cloud_2014.pdf',
  SN:
    'https://www.ovh.com/asia/support/termsofservice/Specific_Conditions_public_cloud%20(Asia)_18022019.pdf',
  TN:
    'https://www.ovh.com/tn/support/documents_legaux/conditions_particulieres_dedicated_cloud_2014.pdf',
  US: 'https://us.ovhcloud.com/legal/third-party-terms',
  WE:
    'https://www.ovh.com/world/support/termsofservice/special_conditions_dedicated_cloud_2014.pdf',
  WS:
    'https://www.ovh.com/world/support/termsofservice/special_conditions_dedicated_cloud_2014.pdf',
};

export const BACKUP_TARIFF_URL = {
  EPCC: {
    ASIA:
      'https://www.ovhcloud.com/asia/enterprise/products/hosted-private-cloud/prices/',
    AU:
      'https://www.ovhcloud.com/en-au/enterprise/products/hosted-private-cloud/prices/',
    CA:
      'https://www.ovhcloud.com/en-ca/enterprise/products/hosted-private-cloud/prices/',
    CZ:
      'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
    DE:
      'https://www.ovhcloud.com/de/enterprise/products/hosted-private-cloud/prices/',
    ES:
      'https://www.ovhcloud.com/es-es/enterprise/products/hosted-private-cloud/prices/',
    FI:
      'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
    FR:
      'https://www.ovhcloud.com/fr/enterprise/products/hosted-private-cloud/prices/',
    GB:
      'https://www.ovhcloud.com/en-gb/enterprise/products/hosted-private-cloud/prices/',
    IE:
      'https://www.ovhcloud.com/en-ie/enterprise/products/hosted-private-cloud/prices/',
    IT:
      'https://www.ovhcloud.com/it/enterprise/products/hosted-private-cloud/prices/',
    LT:
      'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
    MA:
      'https://www.ovhcloud.com/fr-ma/enterprise/products/hosted-private-cloud/prices/',
    NL:
      'https://www.ovhcloud.com/nl/enterprise/products/hosted-private-cloud/prices/',
    PL:
      'https://www.ovhcloud.com/pl/enterprise/products/hosted-private-cloud/prices/',
    PT:
      'https://www.ovhcloud.com/pt/enterprise/products/hosted-private-cloud/prices/',
    QC:
      'https://www.ovhcloud.com/fr-ca/enterprise/products/hosted-private-cloud/prices/',
    SG:
      'https://www.ovhcloud.com/en-sg/enterprise/products/hosted-private-cloud/prices/',
    SN:
      'https://www.ovhcloud.com/fr-sn/enterprise/products/hosted-private-cloud/prices/',
    TN:
      'https://www.ovhcloud.com/fr-tn/enterprise/products/hosted-private-cloud/prices/',
    US:
      'https://us.ovhcloud.com/products/hosted-private-cloud/managed-veeam-backup',
    WE:
      'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
    WS:
      'https://www.ovhcloud.com/es/enterprise/products/hosted-private-cloud/prices/',
  },
  MBM: {
    ASIA: 'https://www.ovhcloud.com/asia/managed-bare-metal/options/',
    AU: 'https://www.ovhcloud.com/en-au/managed-bare-metal/options/',
    CA: 'https://www.ovhcloud.com/en-ca/managed-bare-metal/options/',
    CZ: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/options/',
    DE: 'https://www.ovhcloud.com/de/managed-bare-metal/options/',
    ES: 'https://www.ovhcloud.com/es-es/managed-bare-metal/options/',
    FI: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/options/',
    FR: 'https://www.ovhcloud.com/fr/managed-bare-metal/options/',
    GB: 'https://www.ovhcloud.com/en-gb/managed-bare-metal/options/',
    IE: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/options/',
    IT: 'https://www.ovhcloud.com/it/managed-bare-metal/options/',
    LT: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/options/',
    MA: 'https://www.ovhcloud.com/fr-ma/managed-bare-metal/options/',
    NL: 'https://www.ovhcloud.com/nl/managed-bare-metal/options/',
    PL: 'https://www.ovhcloud.com/pl/managed-bare-metal/options/',
    PT: 'https://www.ovhcloud.com/pt/managed-bare-metal/options/',
    QC: 'https://www.ovhcloud.com/fr-ca/managed-bare-metal/options/',
    SG: 'https://www.ovhcloud.com/en-sg/managed-bare-metal/options/',
    SN: 'https://www.ovhcloud.com/fr-sn/managed-bare-metal/options/',
    TN: 'https://www.ovhcloud.com/fr-tn/managed-bare-metal/options/',
    US: 'https://us.ovhcloud.com/managed-bare-metal/options/',
    WE: 'https://www.ovhcloud.com/en/managed-bare-metal/options/',
    WS: 'https://www.ovhcloud.com/es/managed-bare-metal/options/',
  },
};

export default {
  BACKUP_MINIMUM_HOST_COUNT,
  BACKUP_GUIDES_URL,
  BACKUP_OFFER_NAME,
  BACKUP_OFFER_LEGACY,
  BACKUP_OFFER_PREMIUM,
  BACKUP_OFFER_ADVANCED,
  BACKUP_OFFER_CLASSIC,
  BACKUP_PROPERTIES,
  BACKUP_PROPERTIES_MAP,
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_ENABLING,
  BACKUP_TARIFF_URL,
  CATALOG_INFO,
};
