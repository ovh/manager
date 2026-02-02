import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';
import { Agent } from '@/types/Agent.type';

export const AgentDataLocationCell = ({ vaultId }: Pick<Agent, 'vaultId'>) => {
  const { data, isPending, isError } = useBackupVaultDetails({ vaultId });

  if (!vaultId || isError) {
    return <DataGridTextCell>-</DataGridTextCell>;
  }

  if (isPending) {
    return <OdsSkeleton />;
  }

  return <ResourceLocationCell region={data.currentState.region} />;
};
