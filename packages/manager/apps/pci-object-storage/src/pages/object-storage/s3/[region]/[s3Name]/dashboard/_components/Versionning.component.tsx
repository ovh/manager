import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { VersioningStatusEnum } from '@datatr-ux/ovhcloud-types/cloud/storage';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';

const Versionning = () => {
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const navigate = useNavigate();
  const prefix =
    s3.versioning.status === VersioningStatusEnum.enabled
      ? 'enable'
      : 'disable';

  return (
    <div className="space-y-2" data-testid="versionning-container">
      <div className="flex flex-row justify-between">
        <Badge
          className="h-6"
          variant={
            s3.versioning.status === VersioningStatusEnum.enabled
              ? 'success'
              : 'warning'
          }
        >
          {t(`${prefix}Label`)}
        </Badge>
        {s3.versioning.status !== VersioningStatusEnum.enabled && (
          <Button
            data-testid="activate-versionning-button"
            mode="outline"
            className="h-6"
            size="sm"
            onClick={() => navigate('./active-versionning')}
          >
            <Settings className="size-4" />
            <span className="font-semibold">{t('activateButton')}</span>
          </Button>
        )}
      </div>
      <p>{t(`${prefix}Versionning`)}</p>
    </div>
  );
};

export default Versionning;
