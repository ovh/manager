import { OdsText } from '@ovhcloud/ods-components/react';

import { RhfField } from '@/components/Fields/RhfField.component';
import { Baremetal } from '@/types/Baremetal.type';

type BaremetalOptionProps = Pick<Baremetal, 'name' | 'ip'> & Pick<Baremetal['iam'], 'displayName'>;

export const BaremetalOption = (baremetalService: BaremetalOptionProps) => {
  return (
    <RhfField.ComboboxItem
      key={baremetalService.name}
      value={baremetalService.name}
      selectionLabel={`${baremetalService.name} - ${baremetalService.ip}`}
    >
      <div className="flex flex-col py-3">
        <OdsText preset="span">{baremetalService.displayName}</OdsText>
        <OdsText
          preset="caption"
          className="[&::part(text)]:text-[var(--ods-color-neutral-400)] -mt-3"
        >
          {baremetalService.ip}
        </OdsText>
      </div>
    </RhfField.ComboboxItem>
  );
};

export default BaremetalOption;
