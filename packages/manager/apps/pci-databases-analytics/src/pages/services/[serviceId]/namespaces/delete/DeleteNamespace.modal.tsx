import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
import { useDeleteNamespace } from '@/hooks/api/database/namespace/useDeleteNamespace.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetNamespaces } from '@/hooks/api/database/namespace/useGetNamespaces.hook';
import RouteModal from '@/components/route-modal/RouteModal';

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

  return (
    <RouteModal isLoading={!namespaces || !deletedNamespace}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-namespaces-modal">
            {t('deleteNamespaceTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteNamespaceDescription', {
              name: deletedNamespace?.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-namespaces-cancel-button"
              type="button"
              mode="outline"
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
    </RouteModal>
  );
};

export default DeleteNamespaceModal;
