import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { urlParams, urls } from '@/routes/Routes.constants';
import { Agent } from '@/types/Agent.type';

export const AgentNameCell = ({ id, name }: Pick<Agent, 'id' | 'name'>) => {
  const bucketDashboardHref = useHref(urls.dashboardVaults.replace(urlParams.vaultId, id)); // TODO : Replace with good url

  return (
    <DataGridTextCell>
      <Links href={bucketDashboardHref} label={name} />
    </DataGridTextCell>
  );
};
