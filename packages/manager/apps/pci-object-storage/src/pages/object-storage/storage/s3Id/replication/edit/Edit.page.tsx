import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button, useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { ReplicationForm } from '../_components/form/ReplicationForm.component';
import { useUpdateReplication } from '@/data/hooks/replication/useUpdateReplication.hook';
import { buildReplicationRule } from '../_components/form/buildReplicationRule';
import { useReplicationForm } from '../_components/form/useReplicationForm.hook';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import LinkComponent from '@/components/links/Link.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="editReplicationBreadcrumb"
      namespace="pci-object-storage/storages/s3/replication"
    />
  );
}

const EditReplication = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { s3 } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId, region, s3Name, ruleId } = useParams();

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
      navigate('../');
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
    <>
      <LinkComponent to="../" className="flex items-center gap-2 mb-4">
        <ArrowLeft className="size-4" />
        {t('backLink')}
      </LinkComponent>
      <ReplicationForm
        isEditMode
        replicationTitle={t('editReplicationTitle')}
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
      />
      <div className="flex gap-2 mt-4">
        <Button
          data-testid="edit-replication-cancel-button"
          type="button"
          mode="ghost"
          onClick={() => navigate('../')}
        >
          {t('replicationButtonCancel')}
        </Button>
        <Button type="submit" disabled={isPending} form="replication-form">
          {t('editReplicationButtonConfirm')}
        </Button>
      </div>
    </>
  );
};

export default EditReplication;
