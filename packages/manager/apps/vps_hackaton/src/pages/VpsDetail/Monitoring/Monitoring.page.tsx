import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Card, Button } from '@ovhcloud/ods-react';
import { useMonitoring } from '@/api/hooks/useMonitoring';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import type { TMonitoringPeriod } from '@/domain/entities/monitoring';
import { MonitoringChart } from './components/MonitoringChart.component';

const PERIODS: Array<TMonitoringPeriod> = ['day', 'week', 'month', 'year'];

export const MonitoringPage = () => {
  const { t } = useTranslation('vps');
  const { serviceName } = useParams<{ serviceName: string }>();
  const [period, setPeriod] = useState<TMonitoringPeriod>('day');

  const { data: monitoring, isLoading, isError } = useMonitoring(
    serviceName ?? '',
    period,
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Text preset="heading-4">{t('vps_monitoring_title')}</Text>

          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                label={t(`vps_monitoring_period_${p}`)}
                onClick={() => setPeriod(p)}
              />
            ))}
          </div>
        </div>

        {isLoading && <LoadingSkeleton lines={8} />}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <Text preset="paragraph" className="text-red-700">
              {t('common_error')}
            </Text>
          </div>
        )}

        {monitoring && (
          <div className="grid gap-6 lg:grid-cols-2">
            <MonitoringChart
              title={t('vps_monitoring_cpu')}
              data={monitoring.cpu}
              unit="%"
              color="#3b82f6"
            />

            <MonitoringChart
              title={t('vps_monitoring_memory')}
              data={monitoring.memory}
              unit="%"
              color="#10b981"
            />

            <MonitoringChart
              title={`${t('vps_monitoring_network')} - ${t('vps_monitoring_network_rx')}`}
              data={monitoring.networkRx}
              unit="B/s"
              color="#8b5cf6"
            />

            <MonitoringChart
              title={`${t('vps_monitoring_network')} - ${t('vps_monitoring_network_tx')}`}
              data={monitoring.networkTx}
              unit="B/s"
              color="#f59e0b"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default MonitoringPage;
