import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Kpi = ({ title, value }: { title: string; value: number }) => (
  <div className="flex flex-col gap-2">
    <OdsText preset="heading-5" className="max-w-lg">
      {title}
    </OdsText>
    <OdsText preset="heading-6">{value}</OdsText>
  </div>
);

const Kpis = () => {
  const { t } = useTranslation('dashboard');
  const data = [
    {
      title: t('dashboard_kpis_active_plans_name'),
      value: 5,
    },
    {
      title: t('dashboard_kpis_usage_percent_name'),
      value: 12,
    },
    {
      title: t('dashboard_kpis_coverage_percent_name'),
      value: 5,
    },
  ];

  return (
    <div className="flex flex-row gap-4">
      {data.map((item) => (
        <Kpi key={item.title} title={item.title} value={item.value} />
      ))}
    </div>
  );
};

export default Kpis;
