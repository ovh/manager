import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import {
  VcdaResourceStatus,
  VcdaTileStatus,
} from '@ovh-ux/manager-module-vcd-api';
import TEST_IDS from '@/utils/testIds.constants';
import ComingSoonButton from './ComingSoonButton.component';

type BadgeConfig = {
  color: ODS_BADGE_COLOR;
  labelKey: string;
  ariaKey?: string;
  captionKey?: string;
};

const STATUS_BADGE: Partial<Record<VcdaResourceStatus, BadgeConfig>> = {
  SUSPENDED: {
    color: ODS_BADGE_COLOR.warning,
    labelKey: 'tile.badge.suspended',
  },
  ERROR: { color: ODS_BADGE_COLOR.critical, labelKey: 'tile.badge.error' },
  UPDATING: {
    color: ODS_BADGE_COLOR.success,
    labelKey: 'tile.badge.actif',
    ariaKey: 'tile.ariaLabel.active',
    captionKey: 'tile.badge.updateInProgress',
  },
};

const DEFAULT_BADGE: BadgeConfig = {
  color: ODS_BADGE_COLOR.success,
  labelKey: 'tile.badge.actif',
  ariaKey: 'tile.ariaLabel.active',
};

export default function ActiveBody({
  status,
}: Readonly<{ status: VcdaTileStatus }>) {
  const { t } = useTranslation('vcda');
  if (status.kind !== 'active') return null;

  const cfg = STATUS_BADGE[status.resourceStatus] ?? DEFAULT_BADGE;

  const badge = (
    <OdsBadge
      color={cfg.color}
      label={t(cfg.labelKey)}
      aria-label={cfg.ariaKey ? t(cfg.ariaKey) : undefined}
      data-testid={TEST_IDS.migrationTileStatusBadge}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      {cfg.captionKey ? (
        <div className="flex flex-col gap-2">
          {badge}
          <OdsText preset="caption">{t(cfg.captionKey)}</OdsText>
        </div>
      ) : (
        badge
      )}
      <ComingSoonButton
        triggerId="migration-terminate"
        label={t('serviceTermination.cta')}
        color={ODS_BUTTON_COLOR.critical}
      />
    </div>
  );
}
