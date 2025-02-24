import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
import { useStartApp } from '@/hooks/api/ai/app/useStartApp.hook';

interface StartAppProps {
  app: ai.app.App;
  onSuccess?: () => void;
  onError?: (app: Error) => void;
  onClose?: () => void;
}

const StartApp = ({ app, onError, onSuccess, onClose }: StartAppProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-deploy/apps/app');
  const toast = useToast();

  const { startApp, isPending } = useStartApp({
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
    onStartSuccess: () => {
      toast.toast({
        title: t('appToastSuccessTitle'),
        description: t('startAppToastSuccessDescription'),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleStart = () => {
    startApp({ projectId, appId: app.id });
  };
  return (
    <RouteModal backUrl="../" isLoading={!app?.id} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="start-app-modal">
            {t('startAppTitle')}
          </DialogTitle>
        </DialogHeader>
        <p>
          {t('startAppConfirmation', {
            name: app?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="start-app-cancel-button"
              type="button"
              variant="outline"
            >
              {t('appButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="start-app-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleStart}
          >
            {t('startAppButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default StartApp;
