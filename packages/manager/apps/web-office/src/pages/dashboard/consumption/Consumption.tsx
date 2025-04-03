import { useState } from 'react';
import {
  OdsCheckbox,
  OdsFormField,
  OdsSelect,
  OdsBadge,
} from '@ovhcloud/ods-components/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO, isValid, getDate } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  getOfficeTenantUsageStatisticsQueryKey,
  getOfficeUsageStatistics,
  getOfficeUsageStatisticsQueryKey,
  UsageStatisticsData,
} from '@/api/usageStatistics';
import {
  useDateFnsLocale,
  useOfficeServiceType,
  useOfficeServiceInfos,
} from '@/hooks';
import CustomTooltip from './CustomTooltip.component';

enum Period {
  CURRENT = 'current',
  LAST = 'last',
  LAST_3 = 'last3',
  LAST_12 = 'last12',
}

const periodOptions = [
  Period.CURRENT,
  Period.LAST,
  Period.LAST_3,
  Period.LAST_12,
];
export default function Consumption() {
  const { t } = useTranslation(['dashboard/consumption']);

  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [lineChartShow, setLineChartShow] = useState({
    officeBusiness: true,
    officeProPlus: true,
  });
  const { serviceName } = useParams();

  const locale = useDateFnsLocale();
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd'T'00:00:00XXX");
  const { data: serviceInfos } = useOfficeServiceInfos();
  function getDateRange(period: string): { from: string; to: string } {
    const now = new Date();
    const creationDate = serviceInfos?.creation
      ? parseISO(serviceInfos.creation)
      : null;
    const baseDate = isValid(creationDate) ? creationDate : now;
    const creationDay = getDate(baseDate);
    const isBeforeDate = now.getDate() < creationDay;
    const year = now.getFullYear();
    const month = now.getMonth();

    const calculateDateRange = (fromOffset: number, toOffset: number) => ({
      from: formatDate(new Date(year, month + fromOffset, creationDay)),
      to: formatDate(new Date(year, month + toOffset, creationDay)),
    });

    const periodOffsets: Record<string, [number, number]> = {
      [Period.LAST]: [isBeforeDate ? -2 : -1, isBeforeDate ? -1 : 0],
      [Period.LAST_3]: [isBeforeDate ? -3 : -2, isBeforeDate ? 0 : 1],
      [Period.LAST_12]: [isBeforeDate ? -12 : -11, isBeforeDate ? 0 : 1],
      [Period.CURRENT]: [isBeforeDate ? -1 : 0, isBeforeDate ? 0 : 1],
    };

    return calculateDateRange(
      ...(periodOffsets[period] || periodOffsets[Period.CURRENT]),
    );
  }

  const { from, to } = getDateRange(selectedPeriod);

  const serviceType = useOfficeServiceType(serviceName);
  const { data } = useQuery<UsageStatisticsData>({
    queryKey: [
      serviceType === 'payAsYouGo'
        ? getOfficeUsageStatisticsQueryKey(serviceName)
        : getOfficeTenantUsageStatisticsQueryKey(serviceName),
      serviceName,
      from,
      to,
    ],
    queryFn: () => getOfficeUsageStatistics(serviceName, { from, to }),
  });
  const chartData =
    data?.map(
      (item: {
        date: string;
        lines: { licenceType: string; endOfDayCount: number }[];
      }) => {
        const rawDate = parseISO(item.date);
        const chartItem: {
          date: string;
          rawDate: Date;
          officeBusiness?: number;
          officeProPlus?: number;
        } = {
          date: format(rawDate, 'PPP', { locale }),
          rawDate,
        };

        item.lines.forEach(
          (line: { licenceType: string; endOfDayCount: number }) => {
            if (line.licenceType === 'officeBusiness') {
              chartItem.officeBusiness = line.endOfDayCount;
            } else if (line.licenceType === 'officeProPlus') {
              chartItem.officeProPlus = line.endOfDayCount;
            }
          },
        );

        return chartItem;
      },
    ) || [];
  const handleCheckboxChange = (entry: any, e: any) => {
    setLineChartShow((old) => ({
      ...old,
      [entry.dataKey]: e.detail.checked,
    }));
  };

  const renderLegend = ({ payload }: { payload: any[] }) => {
    return (
      <div className="flex justify-center flex-wrap mt-12">
        {payload.map((entry) => (
          <div key={entry.value} className="flex items-center mx-4">
            <OdsCheckbox
              name={entry.value}
              inputId={entry.value}
              isChecked={
                lineChartShow[entry.dataKey as keyof typeof lineChartShow]
              }
              onOdsChange={(e) => handleCheckboxChange(entry, e)}
            />
            <label htmlFor={entry.value} className="ml-2 flex items-center">
              <OdsBadge
                label={entry.value}
                color={
                  entry.value === t('officeBusiness_serie_name')
                    ? ODS_BADGE_COLOR.success
                    : ODS_BADGE_COLOR.information
                }
              />
            </label>
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <OdsFormField className="w-full md:w-1/4">
        <label slot="label" htmlFor="period-select">
          {t('usage_period')}
        </label>
        <OdsSelect
          id="period-select"
          name="period"
          value={selectedPeriod}
          onOdsChange={(e) => setSelectedPeriod(e.detail.value)}
          data-testid="period-select"
        >
          {periodOptions.map((period) => (
            <option key={period} value={period}>
              {t(`usage_period_${period}`)}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
      <div className="mt-12">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="colorBusiness" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--ods-color-success-300)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--ods-color-success-300)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorProPlus" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--ods-color-primary-300)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--ods-color-primary-300)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickFormatter={(tick) => tick} />
            <YAxis
              label={{
                value: t('common:license_number'),
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip locale={locale} />} />
            <Legend
              aria-labelledby="legend-title"
              content={renderLegend}
              payload={[
                {
                  id: 'officeBusiness',
                  value: t('officeBusiness_serie_name'),
                  type: 'square',
                  color: 'var(--ods-color-success-300)',
                  dataKey: 'officeBusiness',
                  inactive: !lineChartShow.officeBusiness,
                },
                {
                  id: 'officeProPlus',
                  value: t('officeProPlus_serie_name'),
                  type: 'square',
                  color: 'var(--ods-color-primary-300)',
                  dataKey: 'officeProPlus',
                  inactive: !lineChartShow.officeProPlus,
                },
              ]}
            />

            {lineChartShow.officeBusiness && (
              <Area
                type="monotone"
                dataKey="officeBusiness"
                fill="url(#colorBusiness)"
                stroke="var(--ods-color-success-300)"
                strokeWidth={2}
              />
            )}
            {lineChartShow.officeProPlus && (
              <Area
                type="monotone"
                dataKey="officeProPlus"
                stroke="var(--ods-color-primary-300)"
                fill="url(#colorProPlus)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
