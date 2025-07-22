import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { subRoutes } from '@/routes/routes.constant';

export default function CancellationTileItem({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-x-3">
      <OdsButton
        label={t('managed_vcd_dashboard_service_cancellation')}
        variant="ghost"
        iconAlignment="right"
        isDisabled={isDisabled}
        onClick={() => navigate(subRoutes.terminate)}
        icon="chevron-right"
      />
    </div>
  );
}
