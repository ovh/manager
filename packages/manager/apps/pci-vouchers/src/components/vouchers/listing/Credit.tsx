import { DataGridTextCell } from '@ovhcloud/manager-components';
import { TCredit } from '@/interface';

export default function CreditCell({
  credit,
}: {
  credit: Pick<TCredit, 'text'>;
}) {
  return <DataGridTextCell>{credit.text || ''}</DataGridTextCell>;
}
