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

const DeleteDatastore = () => {
  const { projectId, region: dsRegion, alias: dsAlias } = useParams();
  const { t } = useTranslation('ai-tools/dashboard/datastores');
  const toast = useToast();
  const navigate = useNavigate();

  const { deleteDatastore, isPending } = useDeleteDatastore({
    onError: (err) => {
      toast.toast({
        title: t('deleteDatastoreToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('deleteDatastoreToastSuccessTitle'),
        description: t('deleteDatastoreToastSuccessDescription', {
          alias: dsAlias,
        }),
      });
      navigate('../');
    },
  });

  const handleDelete = () => {
    deleteDatastore({
      projectId,
      region: dsRegion,
      alias: dsAlias,
    });
  };
  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-datastore-modal">
            {t('deleteDatastoreTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteDatastoreDescription', {
              alias: dsAlias,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-datastore-cancel-button"
              type="button"
              mode="outline"
            >
              {t('deleteDatastoreButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-datastore-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteDatastoreButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteDatastore;
