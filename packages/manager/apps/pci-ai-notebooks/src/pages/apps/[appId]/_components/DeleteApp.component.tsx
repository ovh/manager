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
import { useDeleteApp } from '@/hooks/api/ai/app/useDeleteApp.hook';

interface DeleteAppProps {
  app: ai.app.App;
  onSuccess?: (app: ai.app.App) => void;
  onError?: (app: Error) => void;
}

const DeleteApp = ({ app, onError, onSuccess }: DeleteAppProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-deploy/apps/app');
  const toast = useToast();

  const { deleteApp, isPending } = useDeleteApp({
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
    onDeleteSuccess: () => {
      toast.toast({
        title: t('appToastSuccessTitle'),
        description: t('deleteAppToastSuccessDescription', {
          name: app.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess(app);
      }
    },
  });

  const handleDelete = () => {
    deleteApp({
      projectId,
      appId: app.id,
    });
  };
  return (
    <RouteModal backUrl="../" isLoading={!app?.id}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-app-modal">
            {t('deleteAppTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          {t('deleteAppDescription', {
            name: app?.spec.name,
          })}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-app-cancel-button"
              type="button"
              variant="outline"
            >
              {t('appButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-app-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteAppButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteApp;
