import { useTranslation } from 'react-i18next';
import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useGetMetric } from '@/hooks/api/database/metric/useGetMetric.hook';
import * as database from '@/types/cloud/project/database';

const MetricTitle = ({ metric }: { metric: string }) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics',
  );
  const { projectId, service } = useServiceData();
  const metricQuery = useGetMetric(
    projectId,
    service.engine,
    service.id,
    metric,
    database.service.MetricPeriodEnum.lastHour,
  );
  if (!metricQuery.data?.name) {
    return <Skeleton className="w-32 h-4" />;
  }
  return (
    <span>
      {t(`metricName-${metric}`, {
        interpolation: { escapeValue: false },
        defaultValue: `${metricQuery.data.name} (${t(
          `metricUnit-${metricQuery.data.units}`,
          {
            defaultValue: metricQuery.data.units,
            interpolation: { escapeValue: false },
          },
        )})`,
        unit: t(`metricUnit-${metricQuery.data.units}`),
      })}
    </span>
  );
};

export default MetricTitle;
