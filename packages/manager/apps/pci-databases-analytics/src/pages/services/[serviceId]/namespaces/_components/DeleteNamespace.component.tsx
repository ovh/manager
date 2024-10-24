import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
import { ModalController } from '@/hooks/useModale';
import * as database from '@/types/cloud/project/database';
import { useDeleteNamespace } from '@/hooks/api/database/namespace/useDeleteNamespace.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface DeleteNamespaceModalProps {
  service: database.Service;
  controller: ModalController;
  namespace: database.m3db.Namespace;
  onSuccess?: (namespace: database.m3db.Namespace) => void;
  onError?: (error: Error) => void;
}

const DeleteNamespaceModal = ({
  service,
  namespace,
  controller,
  onError,
  onSuccess,
}: DeleteNamespaceModalProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );
  const toast = useToast();
  const { deleteNamespace, isPending } = useDeleteNamespace({
    onError: (err) => {
      toast.toast({
        title: t('deleteNamespaceToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteNamespaceToastSuccessTitle'),
        description: t('deleteNamespaceToastSuccessDescription', {
          name: namespace.name,
        }),
      });
      if (onSuccess) {
        onSuccess(namespace);
      }
    },
  });

  const handleDelete = () => {
    deleteNamespace({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      namespaceId: namespace.id,
    });
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-namespaces-modal">
            {t('deleteNamespaceTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteNamespaceDescription', {
              name: namespace.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-namespaces-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteNamespaceButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-namespaces-submit-button"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {t('deleteNamespaceButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNamespaceModal;
