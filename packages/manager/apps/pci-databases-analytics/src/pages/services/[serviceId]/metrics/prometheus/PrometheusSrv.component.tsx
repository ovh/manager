import { Clipboard } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { PrometheusData } from '@/data/api/database/prometheus.api';
import * as database from '@/types/cloud/project/database';

interface PrometheusSrvProps {
  prometheusData: PrometheusData;
}
const PrometheusSrv = ({ prometheusData }: PrometheusSrvProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics/prometheus',
  );
  const promData = prometheusData as database.mongodb.PrometheusEndpoint;
  return (
    <div data-testid="prometheus-data-table" className="w-full space-y-2 mb-4">
      <div>
        <p className="font-semibold capitalize">{t('username')}</p>
        <Clipboard value={`${promData.username}`} />
      </div>
      <div>
        <p className="font-semibold capitalize">{t('srvDomain')}</p>
        <Clipboard value={`${promData.srvDomain}`} />
      </div>
    </div>
  );
};

export default PrometheusSrv;
