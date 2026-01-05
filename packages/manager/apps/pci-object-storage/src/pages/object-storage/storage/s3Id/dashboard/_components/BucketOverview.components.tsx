import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Clipboard,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  useToast,
} from '@datatr-ux/uxlib';
import { HelpCircle } from 'lucide-react';
import { useS3Data } from '../../S3.context';
import { S3RegionServicesTypeEnum } from '@/types/Region';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

const BucketOverview = () => {
  const { s3 } = useS3Data();
  const localeBytesConverter = useLocaleBytesConverter();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const toast = useToast();
  const navigate = useNavigate();
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
      {!isLocaleZone && (
        <>
          <div className="mt-4">
            <h5>{t('spaceUsed')}</h5>
            <p>{localeBytesConverter(s3.objectsSize)}</p>
          </div>
          <div className="mt-4">
            <div className="flex flex-row items-center gap-2">
              <h5>{t('objectNumber')}</h5>
              <Popover>
                <PopoverTrigger>
                  <HelpCircle className="size-4" />
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-sm">{t('objectNumberTooltip')}</p>
                </PopoverContent>
              </Popover>
            </div>
            <p>{s3.objectsCount}</p>
          </div>
        </>
      )}
      <Button
        data-testid="s3-bucket-delete-button"
        variant="critical"
        mode="outline"
        className="mt-4"
        onClick={() => navigate('./delete')}
      >
        {t('deleteBucketButton')}
      </Button>
    </div>
  );
};

export default BucketOverview;
