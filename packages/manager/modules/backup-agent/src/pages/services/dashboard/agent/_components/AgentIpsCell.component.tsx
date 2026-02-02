import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Agent } from '@/types/Agent.type';

export const AgentIpsCell = ({ ips = [] }: Pick<Agent, 'ips'>) => {
  return <DataGridTextCell>{ips.join(', ')}</DataGridTextCell>;
};
