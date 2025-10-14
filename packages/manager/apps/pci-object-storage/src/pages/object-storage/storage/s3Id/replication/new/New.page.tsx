import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useAddReplicationForm } from './formAddReplication/useAddReplicationForm.hook';
import { useAddReplication } from '@/data/hooks/replication/useAddReplication.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { ReplicationModalLayout } from '../_components/ReplicationModalLayout.component';
import { useReplicationFormSubmit } from '../../../../../../hooks/useReplicationFormSubmit.hook';

const CreateReplication = () => {
  const { t } = useTranslation('pci-object-storage/replication');
  const { s3, s3Query } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { form } = useAddReplicationForm();
  const { projectId } = useParams();

  const storagesQuery = useGetStorages(projectId);
  const availableDestinations = storagesQuery.data?.resources || [];

  const { buildReplicationRule } = useReplicationFormSubmit({
    availableDestinations,
    s3Region: s3?.region,
    s3Name: s3?.name,
  });

  const { addReplication, isPending } = useAddReplication({
    onError: (err) => {
      toast.toast({
        title: t('addReplicationToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('addReplicationToastSuccessTitle'),
        description: t('addReplicationToastSuccessDescription'),
      });
      navigate('../replication');
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
    <ReplicationModalLayout
      title={t('addReplicationTitle')}
      isLoading={s3Query.isLoading || storagesQuery.isLoading}
      form={form}
      availableDestinations={availableDestinations}
      isPending={isPending}
      onSubmit={onSubmit}
      submitButtonText={t('addReplicationButtonConfirm')}
    />
  );
};

export default CreateReplication;
