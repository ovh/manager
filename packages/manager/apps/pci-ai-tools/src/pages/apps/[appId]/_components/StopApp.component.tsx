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
import { useStopApp } from '@/data/hooks/ai/app/useStopApp.hook';

interface StopAppProps {
  app: ai.app.App;
  onSuccess?: () => void;
  onError?: (app: Error) => void;
  onClose?: () => void;
}

const StopApp = ({ app, onError, onSuccess, onClose }: StopAppProps) => {
  const { projectId } = useParams();

  const { t } = useTranslation('ai-tools/apps/app');
  const toast = useToast();

  const { stopApp, isPending } = useStopApp({
    onError: (err) => {
      toast.toast({
        title: t('appToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onStopSuccess: () => {
      toast.toast({
        title: t('appToastSuccessTitle'),
        description: t('stopAppToastSuccessDescription', {
          name: app.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStop = () => {
    stopApp({
      projectId,
      appId: app.id,
    });
  };
  return (
    <RouteModal backUrl="../" isLoading={!app?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="stop-app-modal">
            {t('stopAppTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('stopAppConfirmation', {
            name: app?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="stop-app-cancel-button"
              type="button"
              mode="outline"
            >
              {t('appButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="stop-app-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStop}
          >
            {t('stopAppButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default StopApp;
