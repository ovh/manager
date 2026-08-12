import { MODULE_PRODUCT_LINE, MODULE_VSPC_TYPE } from '@/module.constants';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const hasBackupAgentAddon = (vspcTenant: Resource<VSPCTenant>): boolean =>
  vspcTenant.currentState.vspcType === MODULE_VSPC_TYPE &&
  Boolean(vspcTenant.currentState.enabledAddons?.includes(MODULE_PRODUCT_LINE));
