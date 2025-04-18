import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow, Button, useToast } from '@datatr-ux/uxlib';

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
          className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
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
