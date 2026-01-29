import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsCard, OdsButton, OdsMessage, OdsInput } from '@ovhcloud/ods-react';
import { useVpsDetail } from '@/api/hooks/useVpsDetail';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';

export const MigrationPage = () => {
  const { t } = useTranslation('vps');
  const { serviceName } = useParams<{ serviceName: string }>();

  const [scheduledDate, setScheduledDate] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const { data: vps, isLoading } = useVpsDetail(serviceName ?? '');

  // Check if VPS is eligible for migration (example: 2020 range)
  const isEligible = vps?.model.version?.includes('2020') ?? false;

  const handleRequestMigration = async () => {
    setIsRequesting(true);
    // TODO: Call migration API
    setTimeout(() => {
      setIsRequesting(false);
      alert('Migration request submitted');
    }, 1000);
  };

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  return (
    <OdsCard className="p-6">
      <OdsText preset="heading-4" className="mb-2">
        {t('vps_migration_title')}
      </OdsText>
      <OdsText preset="paragraph" className="mb-6 text-gray-600">
        {t('vps_migration_description')}
      </OdsText>

      {!isEligible ? (
        <OdsMessage color="information">
          {t('vps_migration_not_eligible')}
        </OdsMessage>
      ) : (
        <div className="space-y-6">
          <OdsMessage color="success">
            {t('vps_migration_eligible')}
          </OdsMessage>

          <div className="rounded-lg border bg-gray-50 p-6">
            <OdsText preset="heading-5" className="mb-4">
              {t('vps_migration_schedule')}
            </OdsText>

            <div className="mb-4">
              <OdsText preset="label" className="mb-2">
                Preferred date
              </OdsText>
              <OdsInput
                type="date"
                name="scheduledDate"
                value={scheduledDate}
                onOdsChange={(e) => setScheduledDate(e.detail.value as string)}
              />
            </div>

            <div className="flex gap-3">
              <OdsButton
                variant="default"
                label={t('vps_migration_request')}
                onClick={handleRequestMigration}
                isLoading={isRequesting}
              />
              <OdsButton
                variant="outline"
                color="critical"
                label={t('vps_migration_cancel')}
                isDisabled
              />
            </div>
          </div>

          <div className="rounded-lg border bg-blue-50 p-4">
            <OdsText preset="heading-6" className="mb-2">
              Migration benefits
            </OdsText>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>Improved performance with latest hardware</li>
              <li>New features and capabilities</li>
              <li>Enhanced security</li>
              <li>Better network connectivity</li>
            </ul>
          </div>
        </div>
      )}
    </OdsCard>
  );
};

export default MigrationPage;
