import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxGroupProp,
  CheckboxLabel,
  Message,
  MessageBody,
  MessageIcon,
  Radio,
  RadioControl,
  RadioGroup,
  RadioGroupProp,
  RadioLabel,
  RadioValueChangeDetail,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { TSelectedAvailabilityZones } from '@/types';

type GetGroupPropsParams = {
  multiple: boolean;
  availabilityZones: TSelectedAvailabilityZones;
  isInvalid: boolean;
  handleCheckboxChange: (checkedValues: string[]) => void;
  handleRadioChange: (checkedValues: RadioValueChangeDetail) => void;
};

type DeploymentZoneProps = {
  onSelect: (zone: TSelectedAvailabilityZones) => void;
  availabilityZones: TSelectedAvailabilityZones;
  multiple: boolean;
};

function getGroupProps({
  multiple,
  availabilityZones,
  isInvalid,
  handleCheckboxChange,
  handleRadioChange,
}: GetGroupPropsParams): CheckboxGroupProp | RadioGroupProp {
  if (multiple) {
    return {
      invalid: isInvalid,
      defaultValue: availabilityZones.filter(({ checked }) => checked).map(({ zone }) => zone),
      onValueChange: handleCheckboxChange,
      className: clsx('gap-4', isInvalid ? 'mt-4' : 'mt-6'),
    } satisfies CheckboxGroupProp;
  } else {
    return {
      defaultValue: availabilityZones.find(({ checked }) => checked)?.zone,
      onValueChange: handleRadioChange,
      className: clsx('gap-4', 'mt-6'),
    } satisfies RadioGroupProp;
  }
}

const DeploymentZone = ({ onSelect, availabilityZones, multiple }: DeploymentZoneProps) => {
  const { t } = useTranslation('node-pool');

  const handleCheckboxChange = (checkedValues: string[]) => {
    const newStates = availabilityZones.map(({ zone }) => ({
      zone,
      checked: checkedValues.includes(zone),
    }));

    onSelect(newStates);
  };

  const handleRadioChange = (checkedValues: RadioValueChangeDetail) => {
    const newStates = availabilityZones.map(({ zone }) => ({
      zone,
      checked: zone === checkedValues.value,
    }));

    onSelect(newStates);
  };

  const isInvalid = availabilityZones.every(({ checked }) => !checked);

  const groupProps = getGroupProps({
    multiple,
    availabilityZones,
    isInvalid,
    handleCheckboxChange,
    handleRadioChange,
  });

  const Component = multiple ? Checkbox : Radio;
  const Control = multiple ? CheckboxControl : RadioControl;
  const Group = (props: CheckboxGroupProp | RadioGroupProp) =>
    multiple ? (
      <CheckboxGroup {...(props as CheckboxGroupProp)} />
    ) : (
      <RadioGroup {...(props as RadioGroupProp)} />
    );
  const Label = multiple ? CheckboxLabel : RadioLabel;

  return (
    <div className="max-w-3xl">
      <Text className="text-[--ods-color-text-500]" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_deploy_title')}
      </Text>
      <Text className="mt-6">{t('kube_common_node_pool_deploy_description')}</Text>
      {multiple && (
        <Text className="mt-6">
          <strong>
            {t('kube_common_node_pool_deploy_description_explanation_multiple_zone_repartition')}
            {': '}
          </strong>
          {t('kube_common_node_pool_deploy_description_explanation_multiple_zone')}
        </Text>
      )}
      {multiple && isInvalid && (
        <Message dismissible={false} className="mt-6 flex" variant="default" color="critical">
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>{t('kube_common_node_pool_select_zone')}</MessageBody>
        </Message>
      )}
      <Group {...groupProps}>
        <div className="flex w-full  flex-col gap-6 lg:flex-row">
          {availabilityZones?.map(({ zone, checked }) => (
            <Component className="w-full" key={zone} name={zone} value={zone} checked={checked}>
              <PciCard
                color={multiple && isInvalid ? 'critical' : 'neutral'}
                selected={checked}
                selectable
                className="w-full"
              >
                <div className="flex flex-row items-center gap-4">
                  <Control />
                  <Label className="flex font-bold">
                    <Text className="font-bold text-[--ods-color-heading]">{zone}</Text>
                  </Label>
                </div>
              </PciCard>
            </Component>
          ))}
        </div>
      </Group>
    </div>
  );
};

export default DeploymentZone;
