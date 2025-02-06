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
import { useDeleteJob } from '@/hooks/api/ai/job/useDeleteJob.hook';

interface DeleteJobProps {
  job: ai.job.Job;
  onSuccess?: (job: ai.job.Job) => void;
  onError?: (job: Error) => void;
}

const DeleteJob = ({ job, onError, onSuccess }: DeleteJobProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-training/jobs/job');
  const toast = useToast();

  const { deleteJob, isPending } = useDeleteJob({
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
    onDeleteSuccess: () => {
      toast.toast({
        title: t('jobToastSuccessTitle'),
        description: t('deleteJobToastSuccessDescription', {
          name: job.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess(job);
      }
    },
  });

  const handleDelete = () => {
    deleteJob({
      projectId,
      jobId: job.id,
    });
  };
  return (
    <RouteModal backUrl="../" isLoading={!job?.id}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-job-modal">
            {t('deleteJobTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('deleteJobDescription', {
            name: job?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-job-cancel-button"
              type="button"
              variant="outline"
            >
              {t('jobButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-job-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteJobButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteJob;
