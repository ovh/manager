import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { Credit } from '@/interface';

export default function CreditCell({
  credit,
}: {
  credit: Pick<Credit, 'text'>;
}) {
  return <DataGridTextCell>{credit.text || ''}</DataGridTextCell>;
}
