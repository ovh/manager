import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useJobData } from '../../Job.context';
import { isStoppedJob } from '@/lib/statusHelper';

const Configurations = () => {
  const { job } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/dashboard');
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
          size="table"
          variant="table"
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
        className="w-full bg-background border-2 hover:bg-destructive/10 font-semibold border-destructive text-destructive mt-4"
        onClick={() => navigate('./delete')}
        disabled={!isStoppedJob(job.status.state)}
      >
        {t('deleteJobButton')}
      </Button>
    </div>
  );
};

export default Configurations;
