import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button, useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useAddReplication } from '@/data/hooks/replication/useAddReplication.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { ReplicationForm } from '../_components/form/ReplicationForm.component';
import { buildReplicationRule } from '../_components/form/buildReplicationRule';
import { useReplicationForm } from '../_components/form/useReplicationForm.hook';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import LinkComponent from '@/components/links/Link.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="addReplicationBreadcrumb"
      namespace="pci-object-storage/storages/s3/replication"
    />
  );
}

const CreateReplication = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { s3 } = useS3Data();
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
      navigate('../');
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
    <>
      <LinkComponent to="../" className="flex items-center gap-2 mb-4">
        <ArrowLeft className="size-4" />
        {t('backLink')}
      </LinkComponent>
      <ReplicationForm
        replicationTitle={t('addReplicationTitle')}
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
      />
      <div className="flex gap-2 mt-4">
        <Button
          data-testid="add-replication-cancel-button"
          type="button"
          mode="ghost"
          onClick={() => navigate('../')}
        >
          {t('replicationButtonCancel')}
        </Button>
        <Button type="submit" disabled={isPending} form="replication-form">
          {t('addReplicationButtonConfirm')}
        </Button>
      </div>
    </>
  );
};

export default CreateReplication;
