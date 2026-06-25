import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsButton,
  OdsMessage,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { useVcdaStatus } from '@/data/hooks/vcda/useVcdaStatus.hook';
import TEST_IDS from '@/utils/testIds.constants';
import ComingSoonButton from './_components/ComingSoonButton.component';
import ActiveBody from './_components/ActiveBody.component';

const MIGRATION_TILE_ID = 'migration';

export default function MigrationTile() {
  const { t } = useTranslation('vcda');
  const { id } = useParams();
  const { data: status, isPending, isError, refetch } = useVcdaStatus(id);

  const renderBody = () => {
    if (isPending) {
      return <OdsSkeleton data-testid={TEST_IDS.migrationTileSkeleton} />;
    }

    if (isError || !status) {
      return (
        <OdsMessage
          color="critical"
          isDismissible={false}
          role="alert"
          data-testid={TEST_IDS.migrationTileError}
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <OdsText>{t('tile.error.fetch')}</OdsText>
            <OdsButton
              data-testid={TEST_IDS.migrationTileRetryCta}
              variant={ODS_BUTTON_VARIANT.ghost}
              size={ODS_BUTTON_SIZE.sm}
              label={t('tile.error.retry')}
              onClick={() => refetch()}
            />
          </div>
        </OdsMessage>
      );
    }

    switch (status.kind) {
      case 'inactive':
        return (
          <ComingSoonButton
            triggerId="migration-tile-order"
            label={t('tile.cta.order')}
          />
        );
      case 'provisioning':
        return (
          <OdsBadge
            color={ODS_BADGE_COLOR.information}
            label={t('tile.badge.provisioning')}
            aria-label={t('tile.ariaLabel.provisioning')}
            data-testid={TEST_IDS.migrationTileProvisioningBadge}
          />
        );
      case 'deleting':
        return (
          <div className="flex flex-col gap-3">
            <OdsBadge
              color={ODS_BADGE_COLOR.neutral}
              label={t('tile.badge.deleting')}
              data-testid={TEST_IDS.migrationTileDeletingBadge}
            />
            <ComingSoonButton
              triggerId="migration-terminate"
              label={t('serviceTermination.cta')}
              color={ODS_BUTTON_COLOR.critical}
            />
          </div>
        );
      case 'active':
      default:
        return <ActiveBody status={status} />;
    }
  };

  return (
    <div className="h-fit">
      <DashboardTile
        title={t('tile.title')}
        items={[
          {
            id: MIGRATION_TILE_ID,
            label: t('tile.title'),
            value: (
              <div aria-live="polite" aria-busy={isPending}>
                {renderBody()}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
