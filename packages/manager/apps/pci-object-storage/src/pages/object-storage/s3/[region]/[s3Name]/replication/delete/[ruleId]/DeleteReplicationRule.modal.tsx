import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { useS3Data } from '../../../S3.context';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useDeleteReplication } from '@/data/hooks/replication/useDeleteReplication.hook';

const DeleteReplication = () => {
  const { t } = useTranslation(
    'pci-object-storage/storages/s3/replication/delete',
  );
  const { s3, s3Query } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId, ruleId } = useParams();

  const decodedRuleId = ruleId ? decodeURIComponent(ruleId) : '';

  const existingRule = s3?.replication?.rules?.find(
    (rule) => rule.id === decodedRuleId,
  );

  const { deleteReplication, isPending } = useDeleteReplication({
    onError: (err) => {
      toast.toast({
        title: t('deleteReplicationToastErrorTitle'),
        variant: 'critical',
        description: t('deleteReplicationToastErrorMessage', {
          message: getObjectStoreApiErrorMessage(err),
        }),
      });
      navigate('../');
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteReplicationToastSuccessTitle'),
        description: t('deleteReplicationToastSuccessMessage'),
      });
      navigate('../');
    },
  });

  const handleConfirm = () => {
    if (!projectId || !s3?.region || !s3?.name || !decodedRuleId) return;

    deleteReplication({
      projectId,
      region: s3.region,
      name: s3.name,
      ruleId: decodedRuleId,
    });
  };

  if (!existingRule) navigate('./');

  return (
    <RouteModal isLoading={s3Query.isLoading}>
      <DialogContent variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-replication-modal">
            {t('deleteReplicationTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            <Trans
              i18nKey="deleteReplicationDescription"
              ns="pci-object-storage/storages/s3/replication/delete"
              values={{ decodedRuleId }}
              components={{
                strong: <strong className="font-semibold" />,
              }}
            />
          </p>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" mode="ghost" disabled={isPending}>
              {t('deleteReplicationButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            data-testid="delete-replication-confirm-button"
          >
            {t('deleteReplicationButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteReplication;
