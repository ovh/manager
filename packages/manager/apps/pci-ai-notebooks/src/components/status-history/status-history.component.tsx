import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as ai from '@/types/cloud/project/ai';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TIMELINE_MAX } from '@/configuration/polling.constants';

interface StatusHistoryProps {
  history: ai.job.JobStatusHistory[];
}

const StatusHistory = ({ history }: StatusHistoryProps) => {
  const { t } = useTranslation('components/status-history');
  const dateLocale = useDateFnsLocale();
  return (
    <>
      <h5 className="mt-2">{t('timeLineTitle')}</h5>
      <Table data-testid="info-pools-table">
        <TableBody>
          {history?.slice(TIMELINE_MAX).map((state) => (
            <TableRow key={`${state.date}-${state.state}`} className="text-sm">
              <TableCell>
                <Check className="size-4 text-sky-600" />
              </TableCell>
              <TableCell className="font-semibold">{state.state}</TableCell>
              <TableCell className="font-semibold">
                {format(state.date, 'PPpp', { locale: dateLocale })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default StatusHistory;
