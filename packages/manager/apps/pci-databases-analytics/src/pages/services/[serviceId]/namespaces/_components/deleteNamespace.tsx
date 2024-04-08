import { useParams } from 'react-router';
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

import { ModalController } from '@/hooks/useModale';
import { useDeleteNamespace } from '@/hooks/api/namespaces.api.hooks';

import { database } from '@/models/database';

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
        description: err.response.data.message,
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
          <DialogTitle>{t('deleteNamespaceTitle')}</DialogTitle>
          <DialogDescription>
            {t('deleteNamespaceDescription', {
              name: namespace.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('deleteNamespaceButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={handleDelete}>
            {t('deleteNamespaceButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNamespaceModal;
