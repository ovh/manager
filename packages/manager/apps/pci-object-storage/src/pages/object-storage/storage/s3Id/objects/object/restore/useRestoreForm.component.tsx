import { useToast } from '@datatr-ux/uxlib';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useRestoreS3Object } from '@/data/hooks/s3-storage/useRestoreS3Object.hook';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import { useS3Data } from '../../../S3.context';

export const useRestoreS3Form = ({
  onRestoreEnd,
}: {
  onRestoreEnd: () => void;
}) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const toast = useToast();
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');

  const { data: objectData } = useGetS3Object({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
  });

  const isExtending = !!objectData?.restoreStatus?.expireDate;

  const { restoreS3Object, isPending } = useRestoreS3Object({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onRestoreSuccess: () => {
      toast.toast({
        title: t('objectToastSuccessTitle'),
        description: isExtending
          ? t('extendRestoreObjectToastSuccessDescription')
          : t('restoreObjectToastSuccessDescription'),
      });
      onRestoreEnd();
    },
  });

  const onSubmit: SubmitHandler<{
    days: number;
  }> = (formValues) => {
    restoreS3Object({
      projectId,
      region: s3.region,
      name: s3.name,
      key: objectKey,
      days: formValues.days,
    });
  };

  return {
    onSubmit,
    isPending,
    currentExpireDate: objectData?.restoreStatus?.expireDate,
  };
};
