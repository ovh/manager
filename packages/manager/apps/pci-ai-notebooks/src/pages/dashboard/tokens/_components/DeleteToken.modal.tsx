import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteToken } from '@/hooks/api/ai/token/useDeleteToken.hook';
import { useGetToken } from '@/hooks/api/ai/token/useGetToken.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeleteToken = () => {
  const { projectId, tokenId: idToken } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/tokens');
  const navigate = useNavigate();
  const tokenQuery = useGetToken(projectId, idToken);
  const toast = useToast();
  const { deleteToken, isPending } = useDeleteToken({
    onError: (err) => {
      toast.toast({
        title: t('deleteTokenToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteTokenToastSuccessTitle'),
        description: t('deleteTokenToastSuccessDescription', {
          name: tokenQuery.data?.spec.name,
        }),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    deleteToken({
      projectId,
      tokenId: idToken,
    });
  };
  return (
    <RouteModal backUrl="../" isLoading={!tokenQuery.isSuccess}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-token-modal">
            {t('deleteTokenTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteTokenDescription', {
              name: tokenQuery.data?.spec.name,
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
    </RouteModal>
  );
};

export default DeleteToken;
