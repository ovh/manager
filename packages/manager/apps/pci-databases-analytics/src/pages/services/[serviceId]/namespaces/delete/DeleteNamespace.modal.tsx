import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
import { useDeleteNamespace } from '@/hooks/api/database/namespace/useDeleteNamespace.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetNamespaces } from '@/hooks/api/database/namespace/useGetNamespaces.hook';
import { Skeleton } from '@/components/ui/skeleton';

const DeleteNamespaceModal = () => {
  const { projectId, namespaceId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const namespacesQuery = useGetNamespaces(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const namespaces = namespacesQuery.data;
  const deletedNamespace = namespaces?.find((n) => n.id === namespaceId);

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
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteNamespaceToastSuccessTitle'),
        description: t('deleteNamespaceToastSuccessDescription', {
          name: deletedNamespace.name,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (namespaces && !deletedNamespace) navigate('../');
  }, [namespaces, deletedNamespace]);

  const handleDelete = () => {
    deleteNamespace({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      namespaceId: deletedNamespace.id,
    });
  };

  const onOpenChange = (open: boolean) => {
    if (!open) navigate('../');
  };

  if (!namespaces || !deletedNamespace)
    return <Skeleton className="w-full h-4" />;

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-namespaces-modal">
            {t('deleteNamespaceTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteNamespaceDescription', {
              name: deletedNamespace.name,
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
