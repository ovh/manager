import { useCallback } from 'react';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { OsdsCheckbox, OsdsCheckboxButton, OsdsText } from '@ovhcloud/ods-components/react';

import { SigningAlgorithms } from '@/types';

type TCheckboxFormFieldProps = {
  value: string[];
  onChange: (updatedOperations: string[]) => void;
};

export const CheckBoxFormField = ({ value = [], onChange }: TCheckboxFormFieldProps) => {
  const handleCheckboxChange = useCallback(
    (signingAlgorithm: string, isChecked: boolean) => {
      const updatedOperations = isChecked
        ? [...value, signingAlgorithm]
        : value.filter((op) => op !== signingAlgorithm);

      onChange(updatedOperations);
    },
    [value, onChange],
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Object.values(SigningAlgorithms).map((signingAlgorithm) => (
        <OsdsCheckbox
          key={signingAlgorithm}
          checked={value.includes(signingAlgorithm)}
          onOdsCheckedChange={(event) => {
            handleCheckboxChange(signingAlgorithm, event.detail.checked);
          }}
        >
          <OsdsCheckboxButton color={ODS_THEME_COLOR_INTENT.primary}>
            <span slot="end">
              <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_THEME_TYPOGRAPHY_SIZE._500}>
                {signingAlgorithm}
              </OsdsText>
            </span>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
      ))}
    </div>
  );
};
