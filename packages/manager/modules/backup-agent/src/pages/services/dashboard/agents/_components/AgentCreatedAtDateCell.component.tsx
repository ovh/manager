import { DataGridTextCell, useFormatDate } from '@ovh-ux/manager-react-components';

export const AgentCreatedAtDateCell = ({ date }: { date: string}) => {
  const formatDate = useFormatDate()

  return (
    <DataGridTextCell>
      {formatDate({
        date,
        format: 'P'
      })}
    </DataGridTextCell>
  );
};
