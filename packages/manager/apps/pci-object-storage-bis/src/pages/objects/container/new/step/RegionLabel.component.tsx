import { OdsText } from '@ovhcloud/ods-components/react';

interface RegionLabelProps {
  label: string;
  isSelected?: boolean;
}

export function RegionLabel({ label, isSelected }: Readonly<RegionLabelProps>) {
  return (
    <div className="p-6">
      <OdsText className={isSelected ? 'font-bold' : ''} preset="paragraph">
        {label}
      </OdsText>
    </div>
  );
}
