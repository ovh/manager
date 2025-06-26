import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  OdsFormField,
  OdsIcon,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  OdsToggleChangeEventDetail,
  OdsToggleCustomEvent,
} from '@ovhcloud/ods-components';

type RhfToggleFieldProps = {
  field: ControllerRenderProps<FieldValues, string>;
  label: string;
  tooltip?: string;
};

export const RhfToggleField = ({
  field,
  label,
  tooltip,
}: RhfToggleFieldProps) => {
  const toggleId = `${field.name}-toggle`;
  return (
    <OdsFormField
      key={toggleId}
      className="w-full max-w-md flex flex-row items-center gap-x-2"
    >
      <label
        htmlFor={toggleId}
        slot="label"
        className="flex items-center gap-2"
      >
        {label}
        {tooltip && (
          <>
            <OdsIcon name="circle-question" id={toggleId} />
            <OdsTooltip triggerId={toggleId}>{tooltip}</OdsTooltip>
          </>
        )}
      </label>
      <OdsToggle
        className="ml-auto"
        {...field}
        onOdsBlur={field.onBlur}
        onOdsChange={(
          event: OdsToggleCustomEvent<OdsToggleChangeEventDetail>,
        ) => field.onChange(event.detail.value)}
      />
    </OdsFormField>
  );
};
