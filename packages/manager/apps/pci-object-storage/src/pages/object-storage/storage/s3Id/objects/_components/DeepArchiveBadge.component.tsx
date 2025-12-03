import { Badge } from '@datatr-ux/uxlib';
import { Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { isDeepArchive } from '@/lib/s3ObjectHelper';

interface DeepArchiveBadgeProps {
  object: StorageObject;
}

export const DeepArchiveBadge = ({ object }: DeepArchiveBadgeProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { restoreStatus } = object;

  if (!isDeepArchive(object)) {
    return null;
  }

  if (restoreStatus?.expireDate) {
    return (
      <Badge variant={'information'}>
        {t('available')} &nbsp;
        <FormattedDate
          date={new Date(restoreStatus?.expireDate)}
          options={{
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }}
        />
      </Badge>
    );
  }

  if (restoreStatus?.inProgress) {
    return <Badge variant={'information'}>{t('inProgressRestore')}</Badge>;
  }

  return <Badge variant="neutral">Non restauré</Badge>;
};
