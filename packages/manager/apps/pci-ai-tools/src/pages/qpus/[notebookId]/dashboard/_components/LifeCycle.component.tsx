import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { convertSecondsToTimeString } from '@/lib/durationHelper';
import StatusHistory from '@/components/status-history/status-history.component';

const LifeCycle = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation('ai-tools/notebooks/notebook/dashboard');
  return (
    <>
      <h5>{t('durationTitle')}</h5>
      {convertSecondsToTimeString(notebook.status.duration, false)}
      <StatusHistory history={notebook.status.lastJobStatus.history} />
    </>
  );
};

export default LifeCycle;
