import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import { ArrowRight } from 'lucide-react';
import Link from '@/components/links/Link.component';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';
import { fromISO8601 } from '@/lib/iso8601DurationHelper';

const ObjectLock = () => {
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const isObjectLockEnabled =
    s3.objectLock.status === storages.ObjectLockStatusEnum.enabled;
  const prefix = isObjectLockEnabled ? 'enable' : 'disable';

  // Parse retention duration if available
  const hasRetention = !!s3.objectLock.rule;
  const duration = hasRetention
    ? fromISO8601(s3.objectLock.rule?.period)
    : null;

  return (
    <div data-testid="object-lock-container">
      <div className="flex flex-row justify-between items-center">
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
          <Link
            to={'./object-lock-options'}
            className="flex items-center"
            data-testid="object-lock-link"
          >
            {t('objectLockOptionsButton')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        )}
      </div>

      {isObjectLockEnabled && (
        <>
          <div className="mt-4">
            <h5>{t('objectLockRetentionGroupLabel')}</h5>
            <p>
              {hasRetention
                ? t('objectLockRetentionLabelenabled')
                : t('objectLockRetentionLabeldisabled')}
            </p>
          </div>

          {hasRetention && (
            <>
              <div className="mt-4">
                <h5>{t('objectLockRetentionModeGroupLabel')}</h5>
                <p>
                  {t(
                    `objectLockRetentionModeLabel_${s3.objectLock.rule?.mode}`,
                  )}
                </p>
              </div>

              <div className="mt-4">
                <h5>{t('objectLockDurationLabel')}</h5>
                <p>
                  {duration?.value}{' '}
                  {t(
                    duration?.unit === 'Y'
                      ? 'objectLockDurationUnitYears'
                      : 'objectLockDurationUnitDays',
                    { count: duration?.value || 1 },
                  )}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ObjectLock;
