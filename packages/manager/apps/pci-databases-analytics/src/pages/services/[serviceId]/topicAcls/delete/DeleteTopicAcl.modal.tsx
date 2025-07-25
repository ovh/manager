import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetTopicAcls } from '@/hooks/api/database/topicAcl/useGetTopicAcls.hook';
import { useDeleteTopicAcl } from '@/hooks/api/database/topicAcl/useDeleteTopicAcl.hook';

const DeleteTopicAcl = () => {
  // import translations
  const { topicAclId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const topicAclsQuery = useGetTopicAcls(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const topicAcls = topicAclsQuery.data;
  const deletedTopicAcl = topicAcls?.find((t) => t.id === topicAclId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topicAcls',
  );
  const toast = useToast();
  const { deleteTopicAcl, isPending } = useDeleteTopicAcl({
    onError: (err) => {
      toast.toast({
        title: t('deleteTopicAclToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteTopicAclToastSuccessTitle'),
        description: t('deleteTopicAclToastSuccessDescription', {
          username: deletedTopicAcl.username,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (topicAcls && !deletedTopicAcl) navigate('../');
  }, [topicAcls, deletedTopicAcl]);

  const handleDelete = () => {
    deleteTopicAcl({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      topicAclId: deletedTopicAcl.id,
    });
  };

  return (
    <RouteModal isLoading={!topicAcls || !deletedTopicAcl}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-topic-acl-modal">
            {t('deleteTopicAclTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteTopicAclDescription', {
              username: deletedTopicAcl?.username,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              mode="outline"
              data-testid="delete-topic-acl-cancel-button"
            >
              {t('deleteTopicAclButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            data-testid="delete-topic-acl-submit-button"
          >
            {t('deleteTopicAclButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteTopicAcl;
