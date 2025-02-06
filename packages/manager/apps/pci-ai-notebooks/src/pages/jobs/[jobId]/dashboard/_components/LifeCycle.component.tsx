import { useTranslation } from 'react-i18next';
import { convertSecondsToTimeString } from '@/lib/durationHelper';
import { useJobData } from '../../Job.context';
import StatusHistory from '@/components/status-history/status-history.component';

const LifeCycle = () => {
  const { job } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/dashboard');
  return (
    <>
      <h5>{t('durationTitle')}</h5>
      {convertSecondsToTimeString(job.status.duration, false)}
      <StatusHistory history={job.status.history} />
    </>
  );
};

export default LifeCycle;
