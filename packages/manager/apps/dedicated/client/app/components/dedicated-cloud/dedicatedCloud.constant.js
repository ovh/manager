export const DEDICATED_CLOUD_CONSTANTS = {
  securityOptions: ['pcidss', 'hds', 'hipaa'],
  pccNewGeneration: '2.0',
};

export const UNAVAILABLE_PCC_CODE = [400, 404];

export const VCD_PLAN_CODE = 'pcc-option-to-vcd-migration';

export const MANAGED_PCC_MIGRATION_STATUS = {
  ENABLING: 'enabling',
  UNKNOWN: 'unknown',
};

export const MANAGED_VCD_MIGRATION_STATUS = {
  TO_MIGRATE: 'TO_MIGRATE',
  MIGRATED: 'MIGRATED',
  NOT_ALLOWED: 'NOT_ALLOWED',
};

export const MANAGED_VCD_MIGRATION_STATE = {
  0: MANAGED_VCD_MIGRATION_STATUS.NOT_ALLOWED,
  1: MANAGED_VCD_MIGRATION_STATUS.TO_MIGRATE,
  2: MANAGED_VCD_MIGRATION_STATUS.MIGRATED,
};

export const VCD_GUIDE_LINKS = {
  FR: {
    OFFER: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/dfab4c3-OVHcloud_managed_vcd-FR-1.2.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064095',
  },
  ASIA: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/e563255-OVHcloud_managed_vcd-ASIA-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  AU: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/5b641fa-OVHcloud_managed_vcd-AU-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  CA: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/5520360-OVHcloud_managed_vcd-CA-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  DE: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/b273d98-OVHcloud_managed_vcd-DE-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  ES: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/f63ccf1-OVHcloud_managed_vcd-ES-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  GB: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/ce13f7a-OVHcloud_managed_vcd-GB-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  IE: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/46f4857-OVHcloud_managed_vcd-IE-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  IN: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/c5910fa-OVHcloud_managed_vcd-IN-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  IT: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/1229d6d-OVHcloud_managed_vcd-IT-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  MA: {
    OFFER: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/8ef31b8-OVHcloud_managed_vcd-MA-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064095',
  },
  NL: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/11bb509-OVHcloud_managed_vcd-NL-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  PL: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/6ed51a5-OVHcloud_managed_vcd-PL-1.1.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  PT: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/5e94fe3-OVHcloud_managed_vcd-PT-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  QC: {
    OFFER: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/57504c4-OVHcloud_managed_vcd-QC-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064095',
  },
  SG: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/814866d-OVHcloud_managed_vcd-SG-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  SN: {
    OFFER: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/f9910e8-OVHcloud_managed_vcd-SN-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064095',
  },
  TN: {
    OFFER: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/50f0a09-OVHcloud_managed_vcd-TN-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064095',
  },
  WE: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/3a55cf7-OVHcloud_managed_vcd-WE-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  WS: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/c5946bc-OVHcloud_managed_vcd-WS-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
  DEFAULT: {
    OFFER: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
    TERMS:
      'https://help.ovhcloud.com/csm/en-gb-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    MIGRATION:
      'https://help.ovhcloud.com/csm/en-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064081',
  },
};

export const VCD_SERVICE_PACK_PRICING_MODE = {
  'default-nsxt': 'pcc-default-service-pack-nsxt',
  nsxt: 'pcc-servicepack-default-nsxt',
};

export default {
  DEDICATED_CLOUD_CONSTANTS,
  UNAVAILABLE_PCC_CODE,
  VCD_PLAN_CODE,
  VCD_GUIDE_LINKS,
  VCD_SERVICE_PACK_PRICING_MODE,
  MANAGED_VCD_MIGRATION_STATUS,
  MANAGED_VCD_MIGRATION_STATE,
  MANAGED_PCC_MIGRATION_STATUS,
};
