import { useParams } from 'react-router-dom';
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
import { useKillJob } from '@/hooks/api/ai/job/useKillJob.hook';

interface KillJobProps {
  job: ai.job.Job;
  onSuccess?: () => void;
  onError?: (job: Error) => void;
  onClose?: () => void;
}

const KillJob = ({ job, onError, onSuccess, onClose }: KillJobProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('pci-ai-training/jobs/job');
  const toast = useToast();

  const { killJob, isPending } = useKillJob({
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
    onStopSuccess: () => {
      toast.toast({
        title: t('jobToastSuccessTitle'),
        description: t('stopJobToastSuccessDescription', {
          name: job.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStop = () => {
    killJob({
      projectId,
      jobId: job.id,
    });
  };
  return (
    <RouteModal backUrl="../" isLoading={!job?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="kill-job-modal">
            {t('stopJobTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('stopJobConfirmation', {
            name: job?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="stop-job-cancel-button"
              type="button"
              variant="outline"
            >
              {t('jobButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="stop-job-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStop}
          >
            {t('stopJobButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default KillJob;
