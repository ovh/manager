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

export const TRACKING_PREFIX = 'Baremetal::Managed_baremetal::';

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
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/c0f4445-OVHcloud_managed_vcd-FR-1.0.pdf',
    MIGRATION:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-migration-use-cases?id=kb_article_view&sysparm_article=KB0064095',
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
  TRACKING_PREFIX,
};
