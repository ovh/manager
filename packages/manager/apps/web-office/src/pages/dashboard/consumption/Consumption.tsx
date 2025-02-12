import { useState } from 'react';
import {
  OdsCheckbox,
  OdsFormField,
  OdsSelect,
  OdsText,
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
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
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

  return (
    <>
      <OdsFormField className="w-1/4">
        <label slot="label" htmlFor="period-select">
          {t('usage_period')}
        </label>
        <OdsSelect
          id="period-select"
          name="period"
          value={selectedPeriod}
          onOdsChange={(e) => setSelectedPeriod(e.detail.value)}
          className="w-1/3"
          data-testid="period-select"
        >
          {periodOptions.map((period) => (
            <option key={period} value={period}>
              {t(`usage_period_${period}`)}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
      <div>
        <div className="mb-4 mt-6">
          <OdsCheckbox
            name="officeBusiness"
            inputId="officeBusiness"
            isChecked={lineChartShow.officeBusiness}
            onOdsChange={(e) =>
              setLineChartShow((prev) => ({
                ...prev,
                officeBusiness: e.detail.checked,
              }))
            }
            data-testid="officeBusiness"
          />
          <label htmlFor="officeBusiness" className="ml-4">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('officeBusiness_serie_name')}
            </OdsText>
          </label>
        </div>
        <OdsCheckbox
          name="officeProPlus"
          inputId="officeProPlus"
          isChecked={lineChartShow.officeProPlus}
          onOdsChange={(e) =>
            setLineChartShow((prev) => ({
              ...prev,
              officeProPlus: e.detail.checked,
            }))
          }
          data-testid="officeProPlus"
        />
        <label htmlFor="officeProPlus" className="ml-4">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('officeProPlus_serie_name')}
          </OdsText>
        </label>
      </div>
      <div className="mt-12">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
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
                value: t('license_number'),
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip locale={locale} />} />
            <Legend
              aria-labelledby="legend-title"
              onClick={(payload) => {
                if (payload.dataKey === 'officeBusiness') {
                  setLineChartShow((prev) => ({
                    ...prev,
                    officeBusiness: !prev.officeBusiness,
                  }));
                }
                if (payload.dataKey === 'officeProPlus') {
                  setLineChartShow((prev) => ({
                    ...prev,
                    officeProPlus: !prev.officeProPlus,
                  }));
                }
              }}
              onMouseEnter={(_payload, _index, event) => {
                const { target } = event;

                if (target instanceof HTMLSpanElement) {
                  target.style.cursor = 'pointer';
                }
              }}
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
