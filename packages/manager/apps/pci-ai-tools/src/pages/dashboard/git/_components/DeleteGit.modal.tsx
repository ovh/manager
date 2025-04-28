import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { useDeleteDatastore } from '@/data/hooks/ai/data/useDeleteDatastore.hook';

const DeleteGit = () => {
  const { projectId, region: gitRegion, alias: gitAlias } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('ai-tools/dashboard/git');
  const toast = useToast();
  const { deleteDatastore, isPending } = useDeleteDatastore({
    onError: (err) => {
      toast.toast({
        title: t('deleteGitToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteGitToastSuccessTitle'),
        description: t('deleteGitToastSuccessDescription', {
          alias: gitAlias,
        }),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    deleteDatastore({
      projectId,
      region: gitRegion,
      alias: gitAlias,
    });
  };
  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-git-modal">
            {t('deleteGitTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteGitDescription', {
              alias: gitAlias,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-git-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deleteGitButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-git-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteGitButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteGit;
