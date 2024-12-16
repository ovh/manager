import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useState, useEffect, useCallback } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { SigningAlgorithms } from '@/types';

type TCheckboxFormFieldProps = {
  value: string[];
  onChange: (updatedOperations: string[]) => void;
};

export const CheckBoxFormField = ({
  value = [],
  onChange,
}: TCheckboxFormFieldProps) => {
  const [keyOperations, setKeyOperations] = useState<string[]>(value);

  useEffect(() => {
    setKeyOperations(value);
  }, [value]);

  const handleCheckboxChange = useCallback(
    (signingAlgorithm: string, isChecked: boolean) => {
      const updatedOperations = isChecked
        ? [...keyOperations, signingAlgorithm]
        : keyOperations.filter((op) => op !== signingAlgorithm);

      setKeyOperations(updatedOperations);
      onChange(updatedOperations);
    },
    [keyOperations, onChange],
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Object.values(SigningAlgorithms).map((signingAlgorithm) => (
        <OsdsCheckbox
          key={signingAlgorithm}
          checked={keyOperations?.includes(signingAlgorithm)}
          onOdsCheckedChange={(event) => {
            handleCheckboxChange(signingAlgorithm, event.detail.checked);
          }}
        >
          <OsdsCheckboxButton color={ODS_THEME_COLOR_INTENT.primary}>
            <span slot="end">
              <OsdsText color={ODS_THEME_COLOR_INTENT.primary}>
                {signingAlgorithm}
              </OsdsText>
            </span>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
      ))}
    </div>
  );
};
