import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import PrometheusTargets from './PrometheusTargets.component';
import PrometheusSrv from './PrometheusSrv.component';
import { PrometheusData } from '@/data/api/database/prometheus.api';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';

interface PrometheusEnabledProps {
  prometheusData: PrometheusData;
  isPending: boolean;
  onDisablePrometheusClicked: () => void;
}
const PrometheusEnabled = ({
  prometheusData,
  isPending,
  onDisablePrometheusClicked,
}: PrometheusEnabledProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics/prometheus',
  );
  const navigate = useNavigate();
  if (!prometheusData)
    return (
      <Loader2 className="animate-spin mr-2" data-testid="prometheus-loader" />
    );

  return (
    <div className="flex flex-col gap-2">
      {'targets' in prometheusData ? (
        <PrometheusTargets prometheusData={prometheusData} />
      ) : (
        <PrometheusSrv prometheusData={prometheusData} />
      )}
      <div className="flex flex-col gap-2">
        <Button
          disabled={
            isPending ||
            service.capabilities.prometheusCredentialsReset?.create !==
              database.service.capability.StateEnum.enabled
          }
          size="sm"
          onClick={() => navigate('./reset-prometheus-password')}
        >
          {t('resetPasswordButtonLabel')}
        </Button>
        <Button
          size="sm"
          mode="outline"
          disabled={
            isPending ||
            service.capabilities.service?.update !==
              database.service.capability.StateEnum.enabled
          }
          onClick={onDisablePrometheusClicked}
        >
          {isPending && <Loader2 className="animate-spin mr-2" />}
          {t('disableButtonLabel')}
        </Button>
      </div>
    </div>
  );
};

export default PrometheusEnabled;
