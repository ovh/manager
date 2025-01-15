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

const SelectList = <T extends string>({
  options,
  placeholder,
  name,
  onChange,
  value,
}: {
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

  return options.length > 0 ? (
    <OdsSelect
      placeholder={placeholder}
      name={name}
      className="w-64"
      onOdsChange={onChangeEvent}
      value={value}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </OdsSelect>
  ) : null;
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
    <div className="flex flex-row gap-2">
      <SelectList
        value={resource}
        onChange={(value) => {
          setResource(value);
          setFlavor('');
        }}
        options={[ResourceType.instance, ResourceType.rancher]}
        placeholder="Select a resource"
        name="resource"
      />
      <SelectList
        options={activeInformations.map((instance) => instance.label)}
        placeholder="Gamme"
        name="flavor"
        value={flavor}
        key="flavor"
        onChange={(value) => setFlavor(value)}
      />
      <SelectList
        options={['fr', 'it', 'de']}
        placeholder="Select a country"
        name="country"
        value="fr"
        onChange={(value) => console.log(value)}
      />
      <SelectList
        options={['fr', 'it', 'de']}
        placeholder="Select a country"
        name="country"
        value="fr"
        onChange={(value) => console.log(value)}
      />
    </div>
  );
};

export default Filters;
