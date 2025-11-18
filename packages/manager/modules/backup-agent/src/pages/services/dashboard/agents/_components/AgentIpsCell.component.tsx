import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { Agent } from '@/types/Agent.type';

export const AgentIpsCell = ({ ip: ips = [] }: Pick<Agent, 'ip'>) => {
  return <DataGridTextCell>{ips.join(', ')}</DataGridTextCell>;
};
