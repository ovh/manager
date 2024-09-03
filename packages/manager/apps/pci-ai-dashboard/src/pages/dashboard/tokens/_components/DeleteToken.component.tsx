import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import { ModalController } from '@/hooks/useModale.hook';
import * as ai from '@/types/cloud/project/ai';
import { useDeleteToken } from '@/hooks/api/ai/token/useDeleteToken.hook';

interface DeleteTokenModalProps {
  token: ai.token.Token;
  controller: ModalController;
  onSuccess?: (token: ai.token.Token) => void;
  onError?: (error: Error) => void;
}

const DeleteToken = ({
  token,
  controller,
  onError,
  onSuccess,
}: DeleteTokenModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/tokens');
  const toast = useToast();
  const { deleteToken, isPending } = useDeleteToken({
    onError: (err) => {
      toast.toast({
        title: t('deleteTokenToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteTokenToastSuccessTitle'),
        description: t('deleteTokenToastSuccessDescription', {
          name: token.spec.name,
        }),
      });
      if (onSuccess) {
        onSuccess(token);
      }
    },
  });

  const handleDelete = () => {
    deleteToken({
      projectId,
      tokenId: token.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-token-modal">
            {t('deleteTokenTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteTokenDescription', {
              name: token.spec.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-token-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteTokenButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-token-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteTokenButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteToken;
