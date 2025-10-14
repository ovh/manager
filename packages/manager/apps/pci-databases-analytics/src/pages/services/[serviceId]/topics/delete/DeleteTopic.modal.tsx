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
import { useGetTopics } from '@/hooks/api/database/topic/useGetTopics.hook';
import { useDeleteTopic } from '@/hooks/api/database/topic/useDeleteTopic.hook';

const DeleteTopic = () => {
  // import translations
  const { projectId, topicId } = useParams();
  const navigate = useNavigate();
  const { service } = useServiceData();
  const topicsQuery = useGetTopics(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const topics = topicsQuery.data;
  const deletedTopic = topics?.find((t) => t.id === topicId);

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/topics',
  );
  const toast = useToast();
  const { deleteTopic, isPending } = useDeleteTopic({
    onError: (err) => {
      toast.toast({
        title: t('deleteTopicToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteTopicToastSuccessTitle'),
        description: t('deleteTopicToastSuccessDescription', {
          name: deletedTopic.name,
        }),
      });
      navigate('../');
    },
  });

  useEffect(() => {
    if (topics && !deletedTopic) navigate('../');
  }, [topics, deletedTopic]);

  const handleDelete = () => {
    deleteTopic({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      topicId: deletedTopic.id,
    });
  };

  return (
    <RouteModal isLoading={!topics || !deletedTopic}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-database-modal">
            {t('deleteTopicTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteTopicDescription', { name: deletedTopic?.name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              mode="outline"
              data-testid="delete-database-cancel-button"
            >
              {t('deleteTopicButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            data-testid="delete-database-submit-button"
          >
            {t('deleteTopicButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteTopic;
