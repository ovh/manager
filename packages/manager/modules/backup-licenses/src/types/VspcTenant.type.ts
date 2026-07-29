export const BACKUP_LICENSES_ADDON = 'BACKUP_LICENSES';
export const ADVANCED_VSPC_TYPE = 'ADVANCED';

// `vspcType`/`enabledAddons` are new fields on the same VSPC tenant resource already queried by
// @ovh-ux/backup-agent (see its VSPCTenant type) via the identical /backupServices/tenant/{id}/vspc
// route — assumed nested under `currentState` like the rest of that resource. The BKP-1206 ticket
// itself flags this contract as unconfirmed ("Check with Sreekanth if endpoint is good"): adjust
// here once the real backend response is verified.
export type VspcTenant = {
  id: string;
  vspcType?: string;
  enabledAddons?: string[];
};
