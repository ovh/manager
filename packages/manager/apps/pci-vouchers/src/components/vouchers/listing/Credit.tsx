import { Credit } from '@/interface';
import DataGridTextCell from '../../datagrid/DataGridTextCell';

export default function CreditCell({
  credit,
}: {
  credit: Pick<Credit, 'text'>;
}) {
  return <DataGridTextCell>{credit.text || ''}</DataGridTextCell>;
}
