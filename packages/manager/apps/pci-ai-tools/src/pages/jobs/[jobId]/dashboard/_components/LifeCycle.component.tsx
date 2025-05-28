import { useTranslation } from 'react-i18next';
import { convertSecondsToTimeString } from '@/lib/durationHelper';
import { useJobData } from '../../Job.context';
import StatusHistory from '@/components/status-history/status-history.component';

const LifeCycle = () => {
  const { job } = useJobData();
  const { t } = useTranslation('ai-tools/jobs/job/dashboard');
  return (
    <>
      <h5>{t('durationTitle')}</h5>
      <span>{convertSecondsToTimeString(job.status.duration, false)}</span>
      <StatusHistory history={job.status.history} />
    </>
  );
};

export default LifeCycle;
