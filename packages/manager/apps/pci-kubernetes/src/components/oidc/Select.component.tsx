import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import {
  ODS_SELECT_SIZE,
  OdsSelectValueChangeEventDetail,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { SigningAlgorithms } from '@/types';

type SelectProps = {
  name: string;
  value: string;
  onChange: (
    event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => void;
};

export const Select = ({ name, value, onChange }: SelectProps) => (
  <OsdsSelect
    className="mt-4"
    name={name}
    size={ODS_SELECT_SIZE.md}
    value={value}
    onOdsValueChange={onChange}
  >
    {Object.values(SigningAlgorithms).map((signingAlgorithm) => (
      <OsdsSelectOption value={signingAlgorithm} key={signingAlgorithm}>
        {signingAlgorithm}
      </OsdsSelectOption>
    ))}
  </OsdsSelect>
);
