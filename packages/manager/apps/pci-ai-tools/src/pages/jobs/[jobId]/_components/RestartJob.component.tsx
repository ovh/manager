import { useTranslation } from 'react-i18next';
import {
  Button,
  Code,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  bash,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useAddJob } from '@/data/hooks/ai/job/useAddJob.hook';

interface RestartJobProps {
  job: ai.job.Job;
  onSuccess?: (job: ai.job.Job) => void;
  onError?: (job: Error) => void;
  onClose?: () => void;
}

const RestartJob = ({ job, onError, onSuccess, onClose }: RestartJobProps) => {
  const { t } = useTranslation('ai-tools/jobs/job');
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
      <DialogContent className="sm:max-w-xl">
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
        <ScrollArea className="h-auto max-h-64">
          <div className="p-2 max-w-lg">
            <Code
              label={t('cliTitle')}
              code={cliRestartCode}
              theme={githubDark}
              lang={bash}
              onCopied={() =>
                toast.toast({
                  title: t('cliToastMessage'),
                })
              }
              lineNumbers={true}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="restart-job-cancel-button"
              type="button"
              mode="outline"
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
