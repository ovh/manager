import {
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstancesInformation } from '@/utils/savingsPlan';
import { InstanceTechnicalName, ResourceType } from '@/types/CreatePlan.type';
import useTechnicalInfo from '@/hooks/useCatalogCommercial';

const SelectWithLabel = <T extends string>({
  label,
  options,
  placeholder,
  name,
  onChange,
  value,
}: {
  label: string;
  options: T[];
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
          placeholder={placeholder}
          name={name}
          id={name}
          className="w-full"
          onOdsChange={onChangeEvent}
          value={value}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </OdsSelect>
      ) : null}
    </div>
  );
};

const Filters = () => {
  const [resource, setResource] = useState<ResourceType>(ResourceType.instance);
  const [flavor, setFlavor] = useState<string>('');
  const { t } = useTranslation(['dashboard']);

  const { data: technicalList = [] } = useTechnicalInfo({
    productCode: InstanceTechnicalName.b3,
  });

  const instancesInformation = useMemo(
    () => getInstancesInformation(technicalList, t),
    [technicalList, t],
  );
  const activeInformations = instancesInformation.filter(
    (instance) => instance.category === resource,
  );

  return (
    <div className="flex flex-row gap-4">
      <SelectWithLabel
        label={t('dashboard_select_label_resource')}
        value={resource}
        onChange={(value) => {
          setResource(value);
          setFlavor('');
        }}
        options={[ResourceType.instance, ResourceType.rancher]}
        placeholder={t('dashboard_select_placeholder_resource')}
        name="resource"
      />
      <SelectWithLabel
        label={t('dashboard_select_label_flavor')}
        options={activeInformations.map((instance) => instance.label)}
        placeholder={t('dashboard_select_placeholder_flavor')}
        name="flavor"
        value={flavor}
        key="flavor"
        onChange={(value) => setFlavor(value)}
      />
      <SelectWithLabel
        label={t('dashboard_select_label_model')}
        options={['fr', 'it', 'de']}
        placeholder={t('dashboard_select_placeholder_model')}
        name="model"
        value="fr"
        onChange={(value) => console.log(value)}
      />
      <SelectWithLabel
        label={t('dashboard_select_label_period')}
        options={['fr', 'it', 'de']}
        placeholder={t('dashboard_select_placeholder_period')}
        name="period"
        value="fr"
        onChange={(value) => console.log(value)}
      />
    </div>
  );
};

export default Filters;
