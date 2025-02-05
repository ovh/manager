import React, { useId, useMemo } from 'react';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { RhfInput } from './RhfInput.component';
import { RhfPassword } from './RhfPassword.component';
import { RhfToggle } from './RhfToggle.component';
import { RhfFieldContext, useRhfFieldContext } from './RhfField.context';

type RhfFieldProps = React.ComponentProps<typeof OdsFormField> & {
  controllerParams: UseControllerProps<FieldValues, string>;
  helperMessage?: string;
};

export const RhfField = ({
  controllerParams,
  className,
  helperMessage,
  ...rest
}: Readonly<RhfFieldProps>) => {
  const id = useId();
  const controller = useController({ ...controllerParams });

  const contextValues = useMemo(
    () => ({
      id,
      helperMessage,
      controller,
    }),
    [id, controller],
  );

  return (
    <RhfFieldContext.Provider value={contextValues}>
      <OdsFormField
        className={`max-w-md ${className}`}
        error={
          (controller.fieldState?.isDirty || undefined) &&
          controller.fieldState?.error &&
          (helperMessage ?? controller.fieldState?.error?.message)
        }
        {...rest}
      ></OdsFormField>
    </RhfFieldContext.Provider>
  );
};

export const RhfLabel = (
  props: Readonly<React.LabelHTMLAttributes<HTMLLabelElement>>,
) => {
  const { id } = useRhfFieldContext();

  return <label htmlFor={id} slot="label" {...props} />;
};

export const RhfVisualHint = (props: React.ComponentProps<typeof OdsText>) => {
  return <OdsText slot="visual-hint" preset="caption" {...props} />;
};

export const RhfHelper = ({
  className,
  ...rest
}: Readonly<React.ComponentProps<typeof OdsText>>) => {
  return (
    <OdsText
      className={`ods-field-helper ${className ?? ''}`}
      slot="helper"
      preset="caption"
      {...rest}
    />
  );
};

export const RhfHelperAuto = (
  props: Readonly<Omit<React.ComponentProps<typeof OdsText>, 'children'>>,
) => {
  const {
    helperMessage,
    controller: { fieldState },
  } = useRhfFieldContext();

  if (!fieldState.isDirty || !fieldState.error) {
    return <RhfHelper {...props}>{helperMessage}</RhfHelper>;
  }

  return <></>;
};

export const RhfVisualHintCounter = ({
  max,
  ...rest
}: Readonly<
  React.ComponentProps<typeof OdsText> & { max: string | number }
>) => {
  const {
    controller: { field },
  } = useRhfFieldContext();

  return (
    <RhfVisualHint {...rest}>
      {field.value?.length ?? 0}/{max}
    </RhfVisualHint>
  );
};

RhfField.Label = RhfLabel;
RhfField.VisualHint = RhfVisualHint;
RhfField.VisualHintCounter = RhfVisualHintCounter;
RhfField.Helper = RhfHelper;
RhfField.HelperAuto = RhfHelperAuto;
RhfField.Input = RhfInput;
RhfField.Password = RhfPassword;
RhfField.Toggle = RhfToggle;
