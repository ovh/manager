import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Agent } from '@/types/Agent.type';

export const AgentPolicyCell = ({ policy }: Pick<Agent, 'policy'>) => {
  return <DataGridTextCell>{policy}</DataGridTextCell>;
};
