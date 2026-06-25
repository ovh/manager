import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
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
import { FEATURES } from '@/utils/features.constants';

const TERMINATE_DISABLED_TOOLTIP_KEYS: Partial<Record<
  VcdaResourceStatus,
  string
>> = {
  UPDATING: 'serviceTermination.disabled.updating',
  SUSPENDED: 'serviceTermination.disabled.suspended',
  ERROR: 'serviceTermination.disabled.error',
  DELETING: 'serviceTermination.disabled.deleting',
};

export default function TerminateAction({
  resourceStatus,
}: Readonly<{ resourceStatus: VcdaResourceStatus }>) {
  const { t } = useTranslation('vcda');
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { data: features } = useFeatureAvailability([
    FEATURES.HPC_VCFAAS_VCDA_TERMINATION,
  ]);
  const isFlagOn = Boolean(features?.[FEATURES.HPC_VCFAAS_VCDA_TERMINATION]);
  const isReady = resourceStatus === 'READY';
  const tooltipKey = TERMINATE_DISABLED_TOOLTIP_KEYS[resourceStatus];

  if (!isFlagOn) return null;

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
