import { APP_FEATURES } from '@/App.constants';

import { urls } from './Routes.constants';

const { basePrefix } = APP_FEATURES;
export function getRoot(): string {
  return basePrefix ? `/${String(basePrefix)}` : '';
}

export function getDeleteTenantUrl(tenantId: string) {
  return urls.deleteTenant.replace(':tenantId', tenantId);
}
