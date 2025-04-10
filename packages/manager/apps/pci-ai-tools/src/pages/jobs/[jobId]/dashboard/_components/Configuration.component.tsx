import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, useToast } from '@datatr-ux/uxlib';
import { useJobData } from '../../Job.context';
import { isStoppedJob } from '@/lib/statusHelper';

const Configurations = () => {
  const { job } = useJobData();
  const { t } = useTranslation('ai-tools/jobs/job/dashboard');
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div data-testid="configuration-container">
      <div className="flex justify-between text-base mr-2">
        <div className="flex flex-row gap-2">
          <p className="font-semibold">{t('jobIdLabel')}</p>
          <p>{job.id}</p>
        </div>
        <Button
          data-testid="dashboard-copy-id-button"
          type="button"
          variant="menu"
          mode="menu"
          size="menu"
          className="shrink-0"
          onClick={() => {
            navigator.clipboard.writeText(job.id);
            toast.toast({
              title: t('jobIdCopyToast'),
            });
          }}
        >
          <Files className="w-4 h-4" />
        </Button>
      </div>
      <Button
        data-testid="job-config-delete-button"
        variant="destructive"
        className="w-full mt-4"
        onClick={() => navigate('./delete')}
        disabled={!isStoppedJob(job.status.state)}
      >
        {t('deleteJobButton')}
      </Button>
    </div>
  );
};

export default Configurations;
