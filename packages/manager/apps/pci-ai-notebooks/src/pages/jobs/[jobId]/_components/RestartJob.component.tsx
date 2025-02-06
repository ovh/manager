import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useAddJob } from '@/hooks/api/ai/job/useAddJob.hook';
import CodeBlock from '@/components/code-block/CodeBlock.component';

interface RestartJobProps {
  job: ai.job.Job;
  onSuccess?: (job: ai.job.Job) => void;
  onError?: (job: Error) => void;
  onClose?: () => void;
}

const RestartJob = ({ job, onError, onSuccess, onClose }: RestartJobProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/job');
  const toast = useToast();
  const cliRestartCode = `ovhai job rerun ${job?.id}`;

  const { addJob, isPending } = useAddJob({
    onError: (err) => {
      toast.toast({
        title: t('jobToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (newJob: ai.job.Job) => {
      toast.toast({
        title: t('jobToastSuccessTitle'),
        description: t('restartJobToastSuccessDescription', {
          name: newJob.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess(newJob);
      }
    },
  });

  const handleRestart = () => {
    const jobInfos: ai.job.JobSpecInput = { ...job.spec };
    addJob(jobInfos);
  };
  return (
    <RouteModal backUrl="../" isLoading={!job?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="restart-job-modal">
            {t('restartJobTitle')}
          </DialogTitle>
        </DialogHeader>
        <p>
          {t('restartJobConfirmation', {
            name: job?.spec.name,
          })}
        </p>
        <div>
          <p className="font-semibold">{t('cliTitle')}</p>
          <p>{t('cliDescription')}</p>
          <CodeBlock code={cliRestartCode} />
        </div>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="restart-job-cancel-button"
              type="button"
              variant="outline"
            >
              {t('jobButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="restart-job-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleRestart}
          >
            {t('restartJobButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default RestartJob;
