import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useS3Data } from '../../S3.context';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { ReplicationForm } from '../_components/form/ReplicationForm.component';
import { useUpdateReplication } from '@/data/hooks/replication/useUpdateReplication.hook';
import { buildReplicationRule } from '../_components/form/buildReplicationRule';
import { useReplicationForm } from '../_components/form/useReplicationForm.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const EditReplication = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { s3, s3Query } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId, ruleId } = useParams();

  const existingRule = s3.replication?.rules?.find(
    (rule) => rule.id === ruleId,
  );

  const { form } = useReplicationForm({
    existingRule,
  });

  const { updateReplication, isPending } = useUpdateReplication({
    onError: (err) => {
      toast.toast({
        title: t('editReplicationToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('editReplicationToastSuccessTitle'),
        description: t('editReplicationToastSuccessDescription'),
      });
      navigate('..');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const replicationRule = buildReplicationRule(formValues);
    if (!replicationRule || !s3?.region || !s3?.name || !ruleId) return;

    updateReplication({
      projectId,
      region: s3.region,
      name: s3.name,
      replicationRule,
    });
  });

  return (
    <RouteModal isLoading={s3Query.isLoading}>
      <DialogContent className="p-0 max-w-3xl" variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="edit-replication-modal">
            {t('editReplicationTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ReplicationForm
            isEditMode
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
          />
        </DialogBody>
        <DialogFooter className="border-t">
          <DialogClose asChild>
            <Button
              data-testid="edit-replication-cancel-button"
              type="button"
              mode="ghost"
            >
              {t('replicationButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} form="replication-form">
            {t('editReplicationButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default EditReplication;
