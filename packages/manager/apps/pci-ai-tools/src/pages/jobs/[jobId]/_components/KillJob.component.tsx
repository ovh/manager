import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useKillJob } from '@/data/hooks/ai/job/useKillJob.hook';
import { useGetJob } from '@/data/hooks/ai/job/useGetJob.hook';

interface KillJobProps {
  job: ai.job.Job;
  onSuccess?: () => void;
  onError?: (job: Error) => void;
  onClose?: () => void;
}

const KillJob = ({ job, onError, onSuccess, onClose }: KillJobProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/jobs/job');
  const toast = useToast();
  const jobQuery = useGetJob(projectId, job.id);

  const { killJob, isPending } = useKillJob({
    onError: (err) => {
      toast.toast({
        title: t('jobToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      jobQuery.refetch();
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
              mode="outline"
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
