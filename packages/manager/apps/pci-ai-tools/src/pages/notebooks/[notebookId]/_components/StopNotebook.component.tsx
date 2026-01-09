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
import { useStopNotebook } from '@/data/hooks/ai/notebook/useStopNotebook.hook';
import { useQuantum } from '@/hooks/useQuantum.hook';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';

interface StopNotebookProps {
  notebook: ai.notebook.Notebook;
  onSuccess?: () => void;
  onError?: (notebook: Error) => void;
  onClose?: () => void;
  trackingCategory?: string;
}

const StopNotebook = ({
  notebook,
  onError,
  onSuccess,
  onClose,
  trackingCategory,
}: StopNotebookProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const toast = useToast();
  const { mode } = useQuantum();
  const track = useTrackAction();

  const { stopNotebook, isPending } = useStopNotebook({
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
    onStopSuccess: () => {
      toast.toast({
        title: t('notebookToastSuccessTitle'),
        description: t('stopNotebookToastSuccessDescription', {
          name: notebook.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStop = () => {
    if (mode === 'emulators') {
      track(
        TRACKING.emulators.popup.stopNotebookClick('confirm'),
        trackingCategory,
      );
    } else if (mode === 'qpu') {
      track(TRACKING.qpus.popup.stopNotebookClick('confirm'), trackingCategory);
    }
    stopNotebook({
      projectId,
      notebookId: notebook.id,
    });
  };

  const getNotebookType = () => {
    switch (mode) {
      case 'emulators':
        return t('notebookTypeEmulators', { defaultValue: 'Emulator' });
      case 'qpu':
        return t('notebookTypeQPU', { defaultValue: 'QPU' });
      default:
        return t('notebookTypeAI', { defaultValue: 'AI' });
    }
  };

  return (
    <RouteModal backUrl="../" isLoading={!notebook?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="stop-notebook-modal">
            {t('stopNotebookTitle')}
          </DialogTitle>
        </DialogHeader>
        {/* Inject the computed type into the translation */}
        <p className="mt-2">
          {mode === 'qpu'
            ? t('stopQpuNotebookDescription1', { type: getNotebookType() })
            : t('stopNotebookDescription1', { type: getNotebookType() })}
        </p>
        <ul className="list-disc pl-5">
          <li className="ml-3">{t('stopNotebookDescriptionList1')}</li>
          <li className="ml-3">{t('stopNotebookDescriptionList2')}</li>
          <li className="ml-3">{t('stopNotebookDescriptionList3')}</li>
        </ul>
        <div className="inline">
          <span>
            {t('stopNotebookDescription2', { type: getNotebookType() })}
          </span>
          <span> </span>
          <span className="font-bold">{t('stopNotebookDescription2Bis')}</span>
          <span> </span>
          <span>
            {t('stopNotebookDescription2Ter', { type: getNotebookType() })}
          </span>
          <span> </span>
          <span className="font-bold">
            {t('stopNotebookDescription2Quater')}
          </span>
          <span>.</span>
        </div>
        <p>{t('stopNotebookDescription3')}</p>
        <p className="mt-2">
          {t('stopNotebookConfirmation', {
            name: notebook?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="stop-notebook-cancel-button"
              type="button"
              mode="outline"
              onClick={() => {
                if (mode === 'emulators') {
                  track(
                    TRACKING.emulators.popup.stopNotebookClick('cancel'),
                    trackingCategory,
                  );
                } else if (mode === 'qpu') {
                  track(
                    TRACKING.qpus.popup.stopNotebookClick('cancel'),
                    trackingCategory,
                  );
                }
              }}
            >
              {t('notebookButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="stop-notebook-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStop}
          >
            {t('stopNotebookButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default StopNotebook;
