import { DataGridTextCell } from '@ovhcloud/manager-react-components';
import { useTranslatedBytes } from '@/hooks/useTranslatedBytes';

export default function CapacityComponent({ size }: { size: number }) {
  const translatedBytes = useTranslatedBytes(size, 2, true, 'GiB', false);
  return <DataGridTextCell>{translatedBytes}</DataGridTextCell>;
}
