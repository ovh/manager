import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PrometheusTableRowProps {
  name: string;
  value: string;
}
const PrometheusTableRow = ({ name, value }: PrometheusTableRowProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics/prometheus',
  );
  const toast = useToast();
  return (
    <TableRow>
      <TableCell className="font-semibold">{t(`${name}Label`)}</TableCell>
      <TableCell>
        <p className="flex-1 truncate h-6 m-0 max-w-96" title={value}>
          {value}
        </p>
      </TableCell>
      <TableCell className="justify-items-center">
        <Button
          data-testid={`prometheus-copy-${name}-button`}
          type="button"
          size="table"
          variant="table"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.toast({
              title: t('copiedToastMessage'),
            });
          }}
        >
          <Files className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
export default PrometheusTableRow;
