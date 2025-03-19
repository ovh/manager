import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useNotebookData } from '../../Notebook.context';
import RouteModal from '@/components/route-modal/RouteModal';

import { VOLUMES_CONFIG } from '@/components/order/volumes/volume.const';
import { useUpdateNotebook } from '@/data/hooks/ai/notebook/useUpdateNotebook.hook';

const DeleteVolume = () => {
  const { volumeId } = useParams();
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation('ai-tools/components/containers');
  const navigate = useNavigate();
  const toast = useToast();

  const { updateNotebook, isPending } = useUpdateNotebook({
    onError: (err) => {
      toast.toast({
        title: t('containerToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('containerToastErrorTitle'),
        description: t('deleteContainerToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    const volumeSpec: ai.volume.Volume[] = notebook.spec?.volumes?.filter(
      (vol) => vol.mountPath !== VOLUMES_CONFIG.mountDirectory.savedPath,
    );

    const volToDelete = notebook.status?.volumes?.find(
      (vol) => vol.id === volumeId,
    ).mountPath;

    const updateNotebookInfo: ai.notebook.NotebookUpdate = {
      volumes: volumeSpec.filter((vol) => vol.mountPath !== volToDelete),
    };

    updateNotebook({
      projectId,
      notebookId: notebook.id,
      notebookInfo: updateNotebookInfo,
    });
  };

  return (
    <RouteModal backUrl="../" isLoading={!volumeId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-container-modal">
            {t('deleteContainerTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">{t('deleteContainerDescription')}</p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-container-cancel-button"
              type="button"
              mode="outline"
            >
              {t('containerButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-container-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteAction')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteVolume;
