import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@datatr-ux/uxlib';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { TIMELINE_MAX } from '@/configuration/polling.constants';
import ai from '@/types/AI';

interface AppStatusHistoryProps {
  history: ai.app.AppStateHistory[];
}

const AppStatusHistory = ({ history }: AppStatusHistoryProps) => {
  const { t } = useTranslation('ai-tools/components/status-history');
  const dateLocale = useDateFnsLocale();
  return (
    <>
      <h5 className="mt-2">{t('timeLineTitle')}</h5>
      <Table data-testid="info-pools-table">
        <TableBody>
          {history?.slice(TIMELINE_MAX).map((state) => (
            <TableRow key={`${state.date}-${state.state}`} className="text-sm">
              <TableCell className="p-2">
                <Check className="size-4 text-sky-600" />
              </TableCell>
              <TableCell className="font-semibold p-2">{state.state}</TableCell>
              <TableCell className="font-semibold p-2">
                {format(state.date, 'PPpp', { locale: dateLocale })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AppStatusHistory;
