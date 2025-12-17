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
import { useAddReplication } from '@/data/hooks/replication/useAddReplication.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { ReplicationForm } from '../_components/form/ReplicationForm.component';
import { buildReplicationRule } from '../_components/form/buildReplicationRule';
import { useReplicationForm } from '../_components/form/useReplicationForm.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const CreateReplication = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { s3, s3Query } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { form } = useReplicationForm({});
  const { projectId } = useParams();

  const { addReplication, isPending } = useAddReplication({
    onError: (err) => {
      toast.toast({
        title: t('addReplicationToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('addReplicationToastSuccessTitle'),
        description: t('addReplicationToastSuccessDescription'),
      });
      navigate('..');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const replicationRule = buildReplicationRule(formValues);
    if (!replicationRule || !s3?.region || !s3?.name) return;

    addReplication({
      projectId,
      region: s3.region,
      name: s3.name,
      replicationRule,
    });
  });

  return (
    <RouteModal isLoading={s3Query.isLoading}>
      <DialogContent className="p-0 max-w-3xl" variant="information">
        <DialogHeader>
          <DialogTitle data-testid="add-replication-modal">
            {t('addReplicationTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ReplicationForm
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
          />
        </DialogBody>
        <DialogFooter className="border-t">
          <DialogClose asChild>
            <Button
              data-testid="add-replication-cancel-button"
              type="button"
              mode="ghost"
            >
              {t('replicationButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} form="replication-form">
            {t('addReplicationButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default CreateReplication;
