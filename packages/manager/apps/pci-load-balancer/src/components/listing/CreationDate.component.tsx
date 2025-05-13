import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useFormattedDate } from '@/hooks/useFormattedDate';

export default function CreationDate({ date }: { date: string | null }) {
  const displayDate = useFormattedDate(date);

  return <DataGridTextCell>{displayDate}</DataGridTextCell>;
}
