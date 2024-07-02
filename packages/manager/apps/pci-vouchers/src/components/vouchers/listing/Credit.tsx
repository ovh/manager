import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { TCredit } from '@/interface';

export default function CreditCell({
  credit,
}: {
  credit: Pick<TCredit, 'text'>;
}) {
  return <DataGridTextCell>{credit.text || ''}</DataGridTextCell>;
}
