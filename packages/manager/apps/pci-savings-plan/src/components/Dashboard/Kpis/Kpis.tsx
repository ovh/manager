import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText, OdsTooltip, OdsIcon } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Kpi = ({
  title,
  value,
  tooltip,
  index,
}: {
  title: string;
  value: number;
  tooltip: string;
  index: number;
}) => {
  return (
    <div className="flex flex-col gap-2 w-[200px]">
      <OdsText preset="heading-5" className="max-w-lg">
        {title}
        <OdsIcon
          className="my-auto"
          aria-labelledby="tooltip-default"
          name="circle-question"
          id={`trigger-${index}`}
        />
        <OdsTooltip
          triggerId={`trigger-${index}`}
          id={`tooltip-default-${index}`}
        >
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            <span>{tooltip}</span>
          </OdsText>
        </OdsTooltip>
      </OdsText>
      <span className="text-[20px] font-bold mb-0 text-[#0050D7]">{value}</span>
    </div>
  );
};

const Kpis = () => {
  const { t } = useTranslation('dashboard');
  const data = [
    {
      title: t('dashboard_kpis_active_plans_name'),
      tooltip: t('dashboard_kpis_active_plans_tooltip'),
      value: 5,
    },
    {
      title: t('dashboard_kpis_usage_percent_name'),
      tooltip: t('dashboard_kpis_usage_percent_tooltip'),
      value: 12,
    },
    {
      title: t('dashboard_kpis_coverage_percent_name'),
      tooltip: t('dashboard_kpis_coverage_percent_tooltip'),
      value: 5,
    },
  ];

  return (
    <div className="flex flex-row gap-4 items-center mt-7">
      {data.map((item, index) => (
        <React.Fragment key={item.title}>
          <div key={item.title}>
            <Kpi
              title={item.title}
              value={item.value}
              tooltip={item.tooltip}
              index={index}
            />
            {index < data.length - 1 && (
              <div className="h-16 w-px bg-gray-300 mx-2"></div>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Kpis;
