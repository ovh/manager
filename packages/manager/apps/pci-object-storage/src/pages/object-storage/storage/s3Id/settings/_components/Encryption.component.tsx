import { useTranslation } from 'react-i18next';
import { HelpCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import { EncryptionAlgorithmEnum } from '@datatr-ux/ovhcloud-types/cloud/storage/EncryptionAlgorithmEnum';
import { useS3Data } from '../../S3.context';

const Encryption = () => {
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/settings');
  const navigate = useNavigate();
  const prefix =
    s3.encryption.sseAlgorithm === EncryptionAlgorithmEnum.plaintext
      ? 'disable'
      : 'enable';

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between">
        <Badge
          variant={
            s3.encryption.sseAlgorithm === EncryptionAlgorithmEnum.plaintext
              ? 'warning'
              : 'success'
          }
        >
          {t(`${prefix}Label`)}
        </Badge>
        {s3.encryption.sseAlgorithm === EncryptionAlgorithmEnum.plaintext && (
          <Button
            mode="outline"
            size="sm"
            onClick={() => navigate('./active-encryption')}
          >
            <Settings className="size-4 mr-2" />
            <span className="font-semibold">{t('activateButton')}</span>
          </Button>
        )}
      </div>
      <p>{t(`${prefix}EncryptionDesc1`)}</p>
      <div className="flex flex-row items-center gap-2">
        <span className="font-semibold">{t(`${prefix}EncryptionDesc2`)}</span>
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="size-4" />
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm">{t('encryptionTooltip')}</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Encryption;
