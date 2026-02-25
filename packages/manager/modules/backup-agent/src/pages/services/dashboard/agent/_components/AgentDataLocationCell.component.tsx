import { useQuery, useQueryClient } from '@tanstack/react-query';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import { selectVaultRegion } from '@/data/selectors/vaults.selectors';
import { Agent } from '@/types/Agent.type';

export const AgentDataLocationCell = ({ vaultId }: Pick<Agent, 'vaultId'>) => {
  const queryClient = useQueryClient();
  const {
    data: region,
    isPending,
    isError,
  } = useQuery({
    ...vaultsQueries.withClient(queryClient).detail(vaultId!),
    select: selectVaultRegion,
  });

  if (!vaultId || isError) {
    return <DataGridTextCell>-</DataGridTextCell>;
  }

  if (isPending) {
    return <OdsSkeleton />;
  }

  return <ResourceLocationCell region={region} />;
};
