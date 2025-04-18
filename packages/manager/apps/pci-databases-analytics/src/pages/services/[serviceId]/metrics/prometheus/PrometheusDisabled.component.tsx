import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';

interface PrometheusEnabledProps {
  isPending: boolean;
  onEnablePrometheusClicked: () => void;
}
const PrometheusDisabled = ({
  isPending,
  onEnablePrometheusClicked,
}: PrometheusEnabledProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics/prometheus',
  );

  return (
    <div>
      <div>
        <p>{t('activationDescription')}</p>
        <p>{t('activationDelayNote')} </p>
        <p>{t('postActivationNote')}</p>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Button
          disabled={
            isPending ||
            service.capabilities.service?.update !==
              database.service.capability.StateEnum.enabled
          }
          onClick={onEnablePrometheusClicked}
          size="sm"
        >
          {isPending && (
            <Loader2
              className="animate-spin mr-2"
              data-testid="prometheus-button-loader"
            />
          )}
          {t('enableButtonLabel')}
        </Button>
      </div>
    </div>
  );
};

export default PrometheusDisabled;
