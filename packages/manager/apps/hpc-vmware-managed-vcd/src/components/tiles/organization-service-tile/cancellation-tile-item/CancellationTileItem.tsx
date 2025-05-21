import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { subRoutes } from '@/routes/routes.constant';
import { MessageOptions } from '@/context/Message.context';

export default function CancellationTileItem() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { id } = useParams();

  const messageOptions: MessageOptions = {
    includedSubRoutes: [id],
    isDismissible: true,
  };

  return (
    <div className="flex items-center gap-x-3">
      <OdsButton
        label={t('managed_vcd_dashboard_service_cancellation')}
        variant="ghost"
        iconAlignment="right"
        onClick={() =>
          navigate(subRoutes.terminate, { state: { messageOptions } })
        }
        icon="chevron-right"
      />
    </div>
  );
}
