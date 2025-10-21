import React from 'react';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { useLocationDetails } from '@/data/hooks/location/getLocationDetails';
import { VaultResource } from '@/types/Vault.type';

export const VaultRegionCell = (vaultResource: VaultResource) => {
  const { data, isLoading, isError } = useLocationDetails(vaultResource.currentState.azName);

  if (isLoading) return <OdsSkeleton className="w-full" />;
  if (isError) return <DataGridTextCell>{vaultResource.currentState.azName}</DataGridTextCell>;

  return <DataGridTextCell>{data?.name}</DataGridTextCell>;
};
