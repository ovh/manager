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
import { useStartNotebook } from '@/data/hooks/ai/notebook/useStartNotebook.hook';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { useQuantum } from '@/hooks/useQuantum.hook';

interface StartNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: () => void;
  onError?: (notebook: Error) => void;
  onClose?: () => void;
  trackingCategory?: string;
}

const StartNotebook = ({
  notebook,
  onError,
  onSuccess,
  onClose,
  trackingCategory,
}: StartNotebookProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const toast = useToast();
  const track = useTrackAction();
  const { mode } = useQuantum();

  const { startNotebook, isPending } = useStartNotebook({
    onError: (err) => {
      toast.toast({
        title: t('notebookToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onStartSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('startNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStart = () => {
    if (mode === 'emulators') {
      track(
        TRACKING.emulators.popup.startNotebookClick('confirm'),
        trackingCategory,
      );
    } else if (mode === 'qpu') {
      track(
        TRACKING.qpus.popup.startNotebookClick('confirm'),
        trackingCategory,
      );
    }
    startNotebook({
      projectId,
      notebookId: notebook.id,
    });
  };

  return (
    <RouteModal backUrl="../" isLoading={!notebook?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="start-notebook-modal">
            {t('startNotebookTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('startNotebookDescription', {
            name: notebook?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="start-notebook-cancel-button"
              type="button"
              mode="outline"
              onClick={() => {
                if (mode === 'emulators') {
                  track(
                    TRACKING.emulators.popup.startNotebookClick('cancel'),
                    trackingCategory,
                  );
                } else if (mode === 'qpu') {
                  track(
                    TRACKING.qpus.popup.startNotebookClick('cancel'),
                    trackingCategory,
                  );
                }
              }}
            >
              {t('notebookButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="start-notebook-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStart}
          >
            {t('startNotebookButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default StartNotebook;
