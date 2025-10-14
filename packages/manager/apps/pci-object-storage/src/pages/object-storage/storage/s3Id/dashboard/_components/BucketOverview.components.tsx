import { useTranslation } from 'react-i18next';
import { Clipboard, Skeleton, useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { S3RegionServicesTypeEnum } from '@/types/Region';

const BucketOverview = () => {
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const toast = useToast();
  const onCopy = () => toast.toast({ title: t('copyLabel') });

  const endpoint = regions
    ?.find((reg) => reg.name === s3.region)
    .services.find(
      (serv) => serv.name === S3RegionServicesTypeEnum['storage-s3-standard'],
    ).endpoint;

  return (
    <div data-testid="bucket-container">
      <div>
        <h5>{t('bucketNameLabel')}</h5>
        <Clipboard value={s3.name} onCopy={onCopy} />
      </div>
      <div className="mt-4">
        <h5>{t('endpointLabel')}</h5>
        {endpoint ? (
          <Clipboard value={endpoint} onCopy={onCopy} />
        ) : (
          <Skeleton className="h-9 w-full" />
        )}
      </div>
      <div className="mt-4">
        <h5>{t('hostLabel')}</h5>
        <Clipboard value={s3.virtualHost} onCopy={onCopy} />
      </div>
    </div>
  );
};

export default BucketOverview;
