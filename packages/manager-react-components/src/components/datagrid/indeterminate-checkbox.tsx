import { OdsCheckbox } from '@ovhcloud/ods-components/react';

export type IndeterminateCheckboxProps = {
  id: string;
  name: string;
  label: string;
  onChange: () => void;
  isChecked?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
};

export const IndeterminateCheckbox = ({
  id,
  name,
  label,
  onChange,
  isChecked,
  isIndeterminate,
  isDisabled,
}: IndeterminateCheckboxProps) => {
  return (
    <OdsCheckbox
      inputId={id}
      name={name}
      aria-label={label}
      onOdsChange={onChange}
      isChecked={isChecked}
      isIndeterminate={isIndeterminate}
      isDisabled={isDisabled}
    />
  );
};
