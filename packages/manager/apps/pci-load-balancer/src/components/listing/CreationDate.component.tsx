import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { getFormattedDate } from '@/helpers';

export default function CreationDate({ date }: { date: string | null }) {
  const displayDate = getFormattedDate(date);

  return <DataGridTextCell>{displayDate}</DataGridTextCell>;
}
