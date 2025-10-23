import apiClient from '@ovh-ux/manager-core-api';

import { VaultResource } from '@/types/Vault.type';

const getVaultRoute = (locationName: string) => `/location/${locationName}`;

export const getVaultDetails = async (locationName: string) =>
  (await apiClient.v2.get<VaultResource>(getVaultRoute(locationName))).data;
