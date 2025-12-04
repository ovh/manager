import { OdsText } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Agent } from '@/types/Agent.type';

export const AgentNameCell = ({ name }: Pick<Agent, 'name'>) => {
  return (
    <DataGridTextCell>
      <OdsText>{name}</OdsText>
    </DataGridTextCell>
  );
};
