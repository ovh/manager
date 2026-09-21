import { MODULE_PRODUCT_LINE, MODULE_VSPC_TYPE } from '@/module.constants';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const hasBackupAgentAddon = ({
  currentState: { vspcType, enabledAddons, backupAgents },
}: Resource<VSPCTenant>): boolean => {
  if (vspcType !== undefined && enabledAddons !== undefined) {
    return vspcType === MODULE_VSPC_TYPE && enabledAddons.includes(MODULE_PRODUCT_LINE);
  }

  return (backupAgents?.length ?? 0) > 0;
};
