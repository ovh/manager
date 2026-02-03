import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Agent } from '@/types/Agent.type';

export const AgentProductResourceNameCell = ({
  productResourceName = '',
}: Pick<Agent, 'productResourceName'>) => {
  return <DataGridTextCell>{productResourceName}</DataGridTextCell>;
};
