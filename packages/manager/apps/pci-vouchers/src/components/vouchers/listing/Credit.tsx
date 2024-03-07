import { DataGridTextCell } from '@ovhcloud/manager-components';
import { Credit } from '@/interface';

export default function CreditCell({
  credit,
}: {
  credit: Pick<Credit, 'text'>;
}) {
  return <DataGridTextCell>{credit.text || ''}</DataGridTextCell>;
}
