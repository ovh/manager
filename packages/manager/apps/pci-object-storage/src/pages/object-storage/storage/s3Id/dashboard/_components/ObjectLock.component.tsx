import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';

const ObjectLock = () => {
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const prefix =
    s3.objectLock.status === storages.ObjectLockStatusEnum.enabled
      ? 'enable'
      : 'disable';

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between">
        <Badge
          variant={
            s3.objectLock.status === storages.ObjectLockStatusEnum.enabled
              ? 'success'
              : 'warning'
          }
        >
          {t(`${prefix}Label`)}
        </Badge>
        <Badge variant="neutral">{t('comingSoonLabel')}</Badge>
      </div>
    </div>
  );
};

export default ObjectLock;
