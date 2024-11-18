import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { convertSecondsToTimeString } from '@/lib/durationHelper';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Check } from 'lucide-react';
import { format } from 'date-fns';
import { TIMELINE_MAX } from '@/configuration/polling.constants';

const LifeCycle = () => {
  const { notebook, notebookQuery, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');

  console.log(notebook.status.lastJobStatus.history);

  return (
    <>
      <h5>{t('durationTitle')}</h5>
      {convertSecondsToTimeString(notebook.status.duration, false)}
      <h5 className="mt-2">{t('timeLineTitle')}</h5>
      <Table data-testid="info-pools-table">
        <TableBody>
          {notebook.status?.lastJobStatus?.history
            ?.slice(TIMELINE_MAX)
            .map((state, index) => (
              <TableRow key={index} className='text-sm'>
                <TableCell>
                  <Check className="size-4 text-sky-600" />
                </TableCell>
                <TableCell className="font-semibold">{state.state}</TableCell>
                <TableCell className="font-semibold">
                  {format(state.date, 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default LifeCycle;
