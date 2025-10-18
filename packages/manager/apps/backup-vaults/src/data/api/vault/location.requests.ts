import apiClient from '@ovh-ux/manager-core-api';

import { Region } from '@/types/Location.type';

const getVaultDetailsRoute = (vaultId: string) => `/backup/tenant/vault/${vaultId}`;

export const getLocationDetails = async (locationName: string) =>
  (await apiClient.v2.get<Region>(getVaultDetailsRoute(locationName))).data;
