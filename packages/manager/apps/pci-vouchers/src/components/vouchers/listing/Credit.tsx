import { Credit } from '@/interface';
import DataGridTextCell from '../../datagrid/DataGridTextCell';

export default function AvailableCredit({ credit }: { credit: Credit }) {
  return <DataGridTextCell>{credit.text || ''}</DataGridTextCell>;
}
