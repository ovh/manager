import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsCheckbox,
  OdsFormField,
  OdsText,
} from '@ovhcloud/ods-components/react';

export type ColumnsVisibility = {
  id: string;
  isDisabled: boolean;
  label: string;
  enableHiding: boolean;
  isVisible: () => boolean;
  onChange: () => void;
};

export type ColumnsVisibilityProps = {
  columnsVisibility: ColumnsVisibility[];
};

export function VisibilityManagement({
  columnsVisibility,
}: Readonly<ColumnsVisibilityProps>) {
  return (
    <div className="flex flex-col">
      {columnsVisibility
        .filter(({ label }) => label !== '')
        .map((column) => (
          <OdsFormField key={column.id}>
            <div className="flex flex-row items-center gap-x-2">
              <OdsCheckbox
                name={column.id}
                inputId={column.id}
                isDisabled={column.isDisabled}
                isChecked={column.isVisible()}
                onOdsChange={column.onChange}
                ariaLabel={column.label}
              />
              <label slot="label" htmlFor={column.id}>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {column.label}
                </OdsText>
              </label>
            </div>
          </OdsFormField>
        ))}
    </div>
  );
}
