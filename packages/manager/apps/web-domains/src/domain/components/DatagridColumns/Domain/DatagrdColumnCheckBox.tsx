import { Checkbox, CheckboxControl } from '@ovhcloud/ods-react';

interface DatagridColumnCheckBoxProps {
  readonly serviceName: string;
  readonly isSelected: boolean;
  readonly onToggle: (serviceName: string, checked: boolean) => void;
}

export default function DatagridColumnCheckBox({
  serviceName,
  isSelected,
  onToggle,
}: DatagridColumnCheckBoxProps) {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked) =>
        onToggle(serviceName, checked.checked as boolean)
      }
    >
      <CheckboxControl />
    </Checkbox>
  );
}
