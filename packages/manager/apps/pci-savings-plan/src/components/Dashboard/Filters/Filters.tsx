import {
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstancesInformation, isInstanceFlavor } from '@/utils/savingsPlan';
import { InstanceTechnicalName, ResourceType } from '@/types/CreatePlan.type';
import { SavingsPlanService } from '@/types';
import { getLastTwelveMonths } from '@/utils/formatter/date';

const SelectWithLabel = <T extends string>({
  label,
  options,
  placeholder,
  name,
  onChange,
  value,
}: {
  label: string;
  options: { label: string; value: T }[];
  placeholder: string;
  name: string;
  onChange: (value: T) => void;
  value: T;
}) => {
  const onChangeEvent = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    onChange(event.target.value as T);
  };

  return (
    <div className="flex flex-col w-64">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-[#4D5592]">
        {label}
      </label>
      {options.length > 0 ? (
        <OdsSelect
          aria-label={label}
          placeholder={placeholder}
          name={name}
          id={name}
          className="w-full"
          onOdsChange={onChangeEvent}
          value={value}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </OdsSelect>
      ) : null}
    </div>
  );
};

interface FiltersProps {
  defaultFilter: SavingsPlanService;
  savingsPlan: SavingsPlanService[];
  locale: string;
}

const Filters = ({ defaultFilter, savingsPlan, locale }: FiltersProps) => {
  const lastTwelveMonths = useMemo(() => getLastTwelveMonths(locale), [locale]);

  const [resource, setResource] = useState<ResourceType>(ResourceType.instance);
  const [flavor, setFlavor] = useState<InstanceTechnicalName>(
    InstanceTechnicalName.b3,
  );
  const [model, setModel] = useState<string>(defaultFilter.flavor);
  const [period, setPeriod] = useState<string>(lastTwelveMonths[0]);

  const { t } = useTranslation(['dashboard', 'listing', 'create']);

  const uniqueFlavors = [
    ...new Set(savingsPlan.map((plan) => plan.flavor.toLowerCase())),
  ];

  const instancesInformation = useMemo(() => getInstancesInformation(t), [t]);

  const hasRancher = useMemo(
    () => savingsPlan.some((plan) => plan.flavor === 'Rancher'),
    [savingsPlan],
  );

  const availableResourcesOptions = useMemo(() => {
    const hasInstance = savingsPlan.some((plan) =>
      isInstanceFlavor(plan.flavor),
    );
    const options = [];
    if (hasInstance) {
      options.push({
        label: t(`resource_tabs_instance`),
        value: ResourceType.instance,
      });
    }
    if (hasRancher) {
      options.push({
        label: t(`resource_tabs_rancher`),
        value: ResourceType.rancher,
      });
    }
    return options;
  }, [savingsPlan, t]);

  const instanceRangeOptions = useMemo(() => {
    if (resource === ResourceType.instance) {
      const activeInstanceInformation = instancesInformation.filter((info) =>
        savingsPlan.some((plan) =>
          plan.flavor
            .toLowerCase()
            .startsWith(info.technicalName.toLowerCase()),
        ),
      );

      return activeInstanceInformation.map((info) => ({
        label: t(`create:${info.label}`),
        value: info.technicalName,
      }));
    }
    return [
      {
        label: t('resource_tabs_rancher'),
        value: InstanceTechnicalName.rancher,
      },
    ];
  }, [resource, instancesInformation, savingsPlan, t]);

  const modelOptions = useMemo(
    () =>
      uniqueFlavors
        .filter((f) => f.startsWith(flavor))
        .map((f) => ({
          label: f,
          value: f,
        })),
    [flavor, uniqueFlavors],
  );

  return (
    <div className="flex flex-row gap-4">
      <SelectWithLabel
        label={t('dashboard_select_label_resource')}
        value={resource}
        onChange={(value) => {
          setResource(value);
          setFlavor(InstanceTechnicalName.b3);
        }}
        options={availableResourcesOptions}
        placeholder={t('dashboard_select_placeholder_resource')}
        name="resource"
      />
      <SelectWithLabel
        label={t('dashboard_select_label_flavor')}
        options={instanceRangeOptions}
        placeholder={t('dashboard_select_placeholder_flavor')}
        name="flavor"
        value={flavor}
        key="flavor"
        onChange={(value) => setFlavor(value)}
      />
      <SelectWithLabel
        label={t('dashboard_select_label_model')}
        options={modelOptions}
        placeholder={t('dashboard_select_placeholder_model')}
        name="model"
        value={model}
        onChange={setModel}
      />
      <SelectWithLabel
        label={t('dashboard_select_label_period')}
        options={lastTwelveMonths.map((month) => ({
          label: month,
          value: month,
        }))}
        placeholder={t('dashboard_select_placeholder_period')}
        name="period"
        value={period}
        onChange={setPeriod}
      />
    </div>
  );
};

export default Filters;
