import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsButton, OdsTooltip } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { VcdaResourceStatus } from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';

const TERMINATE_DISABLED_TOOLTIP_KEYS: Partial<Record<
  VcdaResourceStatus,
  string
>> = {
  UPDATING: 'serviceTermination.disabled.updating',
  SUSPENDED: 'serviceTermination.disabled.suspended',
  ERROR: 'serviceTermination.disabled.error',
  DELETING: 'serviceTermination.disabled.deleting',
};

// VCDA service termination CTA — enabled only in READY (R2); disabled with a
// per-status tooltip otherwise (R1/R2). Route-based flow (service-termination
// ux_legacy): navigates to the terminate route which renders the DeleteModal.
export default function TerminateAction({
  resourceStatus,
}: Readonly<{ resourceStatus: VcdaResourceStatus }>) {
  const { t } = useTranslation('vcda');
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const isReady = resourceStatus === 'READY';
  const tooltipKey = TERMINATE_DISABLED_TOOLTIP_KEYS[resourceStatus];

  const button = (
    <OdsButton
      id="migration-terminate"
      data-testid={TEST_IDS.migrationTerminateCta}
      variant={ODS_BUTTON_VARIANT.ghost}
      size={ODS_BUTTON_SIZE.sm}
      color={ODS_BUTTON_COLOR.critical}
      label={t('serviceTermination.cta')}
      aria-label={t('serviceTermination.ariaLabel')}
      isDisabled={!isReady}
      onClick={
        isReady
          ? () => {
              trackClick(TRACKING.dashboard.terminateMigration);
              navigate(urls.migrationTerminate.replace(':id', id ?? ''));
            }
          : undefined
      }
    />
  );

  if (isReady || !tooltipKey) {
    return button;
  }

  return (
    <>
      {button}
      <OdsTooltip triggerId="migration-terminate">{t(tooltipKey)}</OdsTooltip>
    </>
  );
}
