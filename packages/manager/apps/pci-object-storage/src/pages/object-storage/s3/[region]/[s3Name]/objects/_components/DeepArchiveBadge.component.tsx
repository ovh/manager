import { Badge } from '@datatr-ux/uxlib';
import { Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { isDeepArchive } from '@/lib/s3ObjectHelper';

interface DeepArchiveBadgeProps {
  object: StorageObject;
}

export const DeepArchiveBadge = ({ object }: DeepArchiveBadgeProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const navigate = useNavigate();

  const onRestoreClicked = () =>
    navigate(`./restore-object?objectKey=${encodeURIComponent(object.key)}`);

  const { restoreStatus } = object;

  if (!isDeepArchive(object) || !restoreStatus) {
    return null;
  }

  const { inProgress, expireDate } = restoreStatus;

  if (inProgress) {
    return <Badge variant={'information'}>{t('inProgressRestore')}</Badge>;
  }

  if (expireDate) {
    return (
      <Badge
        variant={'information'}
        className="flex items-baseline gap-2 cursor-pointer hover:bg-primary-100 transition-colors"
      >
        {t('available')} &nbsp;
        <FormattedDate
          date={new Date(expireDate)}
          options={{
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestoreClicked();
          }}
        >
          <Pen className="size-3" aria-label="edit" />
        </button>
      </Badge>
    );
  }

  return null;
};
