import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, useToast } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { S3RegionServicesTypeEnum } from '@/types/Region';

const BucketOverview = () => {
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const toast = useToast();

  const endpoint = regions
    ?.find((reg) => reg.name === s3.region)
    .services.find(
      (serv) => serv.name === S3RegionServicesTypeEnum['storage-s3-standard'],
    ).endpoint;

  return (
    <div data-testid="bucket-container">
      <div>
        <h5>{t('bucketNameLabel')}</h5>
        <div className="flex justify-between items-center text-base mr-2">
          <p>{s3.name}</p>
          <Button
            type="button"
            size="menu"
            variant="menu"
            mode="menu"
            className="shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(s3.name);
              toast.toast({
                title: t('copyLabel'),
              });
            }}
          >
            <Files className="w-4 h-4" />
            <span className="sr-only">copy</span>
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <h5>{t('endpointLabel')}</h5>
        <div className="flex justify-between items-center text-base mr-2">
          <p>{endpoint}</p>
          <Button
            type="button"
            size="menu"
            variant="menu"
            mode="menu"
            className="shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(endpoint);
              toast.toast({
                title: t('copyLabel'),
              });
            }}
          >
            <Files className="w-4 h-4" />
            <span className="sr-only">copy</span>
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <h5>{t('hostLabel')}</h5>
        <div className="flex justify-between items-center text-base mr-2">
          <p>{s3.virtualHost}</p>
          <Button
            type="button"
            size="menu"
            variant="menu"
            mode="menu"
            className="shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(s3.virtualHost);
              toast.toast({
                title: t('copyLabel'),
              });
            }}
          >
            <Files className="w-4 h-4" />
            <span className="sr-only">copy</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BucketOverview;
