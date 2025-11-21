import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useNotebookData } from '@/pages/notebooks/[notebookId]/Notebook.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { useUpdateNotebook } from '@/data/hooks/ai/notebook/useUpdateNotebook.hook';
import ai from '@/types/AI';

const UpdateAutorestart = () => {
  const { notebook, projectId } = useNotebookData();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const prefix = notebook.spec.timeoutAutoRestart ? 'disable' : 'enable';

  const { updateNotebook, isPending } = useUpdateNotebook({
    onError: (err) => {
      toast.toast({
        title: t('notebookToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t(`${prefix}AutoRestartTitle`),
        description: t(`${prefix}AutoRestartToastSuccessDescription`, {
          name: notebook.spec.name,
        }),
      });
      navigate('../');
    },
  });

  const onSubmit = () => {
    const updateNotebookInfo: ai.notebook.NotebookUpdate = {
      timeoutAutoRestart: !notebook.spec.timeoutAutoRestart,
    };

    updateNotebook({
      projectId,
      notebookId: notebook.id,
      notebookInfo: updateNotebookInfo,
    });
  };

  return (
    <RouteModal backUrl="../">
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle data-testid="update-flavor-modal">
            {t(`${prefix}AutoRestartTitle`)}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          {t(`${prefix}AutoRestartDescription`, {
            name: notebook.spec.name,
          })}
        </p>

        <div className="flex flex-col gap-2">
          <DialogFooter className="flex justify-end">
            <DialogClose asChild>
              <Button
                data-testid="update-autorestart-cancel-button"
                type="button"
                mode="outline"
              >
                {t('notebookButtonCancel')}
              </Button>
            </DialogClose>
            <Button
              data-testid="update-autorestart-submit-button"
              type="button"
              disabled={isPending}
              onClick={onSubmit}
            >
              {t(`${prefix}AutoRestartButtonConfirm`, {
                name: notebook.spec.name,
              })}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateAutorestart;
