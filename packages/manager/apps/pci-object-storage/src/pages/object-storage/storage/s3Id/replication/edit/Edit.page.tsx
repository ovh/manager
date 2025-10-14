import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast, Skeleton } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useEditReplicationForm } from './useEditReplicationForm.hook';
import { useUpdateReplication } from '@/data/hooks/replication/useUpdateReplication.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { ReplicationModalLayout } from '../_components/ReplicationModalLayout.component';
import { useReplicationFormSubmit } from '../../../../../../hooks/useReplicationFormSubmit.hook';

const EditReplication = () => {
  const { t } = useTranslation('pci-object-storage/replication');
  const { s3, s3Query } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId, ruleId } = useParams();

  const storagesQuery = useGetStorages(projectId);
  const availableDestinations = storagesQuery.data?.resources || [];

  const existingRule = s3.replication?.rules?.find(
    (rule) => rule.id === ruleId,
  );

  const { form } = useEditReplicationForm({
    existingRule,
    availableDestinations,
  });

  const { buildReplicationRule } = useReplicationFormSubmit({
    availableDestinations,
    s3Region: s3?.region,
    s3Name: s3?.name,
  });

  const { updateReplication, isPending } = useUpdateReplication({
    onError: (err) => {
      toast.toast({
        title: t('editReplicationToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('editReplicationToastSuccessTitle'),
        description: t('editReplicationToastSuccessDescription'),
      });
      navigate('../replication');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const replicationRule = buildReplicationRule(formValues);
    if (!replicationRule || !s3?.region || !s3?.name || !ruleId) return;

    updateReplication({
      projectId,
      region: s3.region,
      name: s3.name,
      ruleId,
      replicationRule,
    });
  });

  const isLoading =
    s3Query.isLoading || storagesQuery.isLoading || !existingRule;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-6" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
        </div>
        <Skeleton className="w-32 h-10" />
      </div>
    );
  }

  return (
    <ReplicationModalLayout
      title={t('editReplicationTitle')}
      isLoading={isLoading}
      form={form}
      availableDestinations={availableDestinations}
      isPending={isPending}
      onSubmit={onSubmit}
      submitButtonText={t('editReplicationButtonConfirm')}
    />
  );
};

export default EditReplication;
