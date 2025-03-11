const VEEAM_BACKUP_FAMILY_PLAN_CODE = 'backup-veeam-vcd-storage';

export const VEEAM_BACKUP_CONSUMPTION_PLAN_CODE = {
  BRONZE: `${VEEAM_BACKUP_FAMILY_PLAN_CODE}-bronze`,
  SILVER: `${VEEAM_BACKUP_FAMILY_PLAN_CODE}-silver`,
  GOLD: `${VEEAM_BACKUP_FAMILY_PLAN_CODE}-gold`,
} as const;

export const VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE = 'backup-veeam-vcd-vm';
