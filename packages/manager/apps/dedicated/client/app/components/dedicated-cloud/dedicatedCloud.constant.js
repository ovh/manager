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
  FR: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
  DEFAULT: 'https://www.ovhcloud.com/en/lp/vmware-vcd-evolution/',
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
