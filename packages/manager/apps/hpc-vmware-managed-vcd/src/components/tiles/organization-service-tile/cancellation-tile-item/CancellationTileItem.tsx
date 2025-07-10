import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { subRoutes } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constants';
import TEST_IDS from '@/utils/testIds.constants';

export default function CancellationTileItem() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <div className="flex items-center gap-x-3">
      <OdsButton
        label={t('managed_vcd_dashboard_service_cancellation')}
        variant="ghost"
        iconAlignment="right"
        onClick={() => {
          trackClick(TRACKING.terminate.fromDashboard);
          navigate(subRoutes.terminate);
        }}
        icon="chevron-right"
        data-testid={TEST_IDS.terminateCta}
      />
    </div>
  );
}
