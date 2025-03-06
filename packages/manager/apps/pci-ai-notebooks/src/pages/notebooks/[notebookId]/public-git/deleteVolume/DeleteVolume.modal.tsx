import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useNotebookData } from '../../Notebook.context';
import { useUpdateNotebook } from '@/hooks/api/ai/notebook/useUpdateNotebook.hook';
import RouteModal from '@/components/route-modal/RouteModal';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VOLUMES_CONFIG } from '@/components/order/volumes/volume.const';

const DeleteVolume = () => {
  const { volumeId } = useParams();
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation('components/public-git');
  const navigate = useNavigate();
  const toast = useToast();

  const { updateNotebook, isPending } = useUpdateNotebook({
    onError: (err) => {
      toast.toast({
        title: t('publicGitToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('publicGitToastSuccessTitle'),
        description: t('deletePublicGitToastSuccessDescription'),
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
          <DialogTitle data-testid="delete-public-git-modal">
            {t('deletePublicGitTitle')}
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2">{t('deletePublicGitDescription')}</p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-public-git-cancel-button"
              type="button"
              variant="outline"
            >
              {t('publicGitButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-public-git-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deletePublicGitButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteVolume;
