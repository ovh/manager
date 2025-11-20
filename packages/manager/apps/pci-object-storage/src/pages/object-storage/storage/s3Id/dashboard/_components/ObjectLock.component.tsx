import { useTranslation } from 'react-i18next';
import { Badge, Button } from '@datatr-ux/uxlib';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';

const ObjectLock = () => {
  const navigate = useNavigate();
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const isObjectLockEnabled =
    s3.objectLock.status === storages.ObjectLockStatusEnum.enabled;
  const prefix = isObjectLockEnabled ? 'enable' : 'disable';

  return (
    <>
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
          {isObjectLockEnabled && (
            <Button
              data-testid="label-object-lock-options-button"
              mode="outline"
              size="sm"
              className="h-6"
              onClick={() => navigate('./object-lock-options')}
            >
              <Settings className="size-4" />
              <span className="font-semibold">
                {t('objectLockOptionsButton')}
              </span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ObjectLock;
