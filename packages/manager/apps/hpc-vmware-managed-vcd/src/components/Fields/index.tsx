import React, { useId, useMemo } from 'react';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';
import {
  Control,
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { RhfFieldContext, useRhfFieldContext } from './RhfField.context';
import { RhfQuantity } from './RhfQuantity.component';
import { RhfInput } from './RhfInput.component';

type RhfFieldProps = React.ComponentProps<typeof OdsFormField> & {
  controllerParams: UseControllerProps<FieldValues, string>;
  helperMessage?: string;
  isHiddenError?: boolean;
  control?: Control;
};

export const RhfField = ({
  controllerParams,
  className,
  helperMessage,
  isHiddenError,
  control,
  ...rest
}: Readonly<RhfFieldProps>) => {
  const id = useId();
  const controller = useController({ ...controllerParams, control });

  const contextValues = useMemo(
    () => ({
      id,
      helperMessage,
      controller,
    }),
    [id, controller],
  );

  const hasError = !isHiddenError && !!controller.fieldState?.error;
  const errorMessage = helperMessage || controller.fieldState?.error?.message;

  return (
    <RhfFieldContext.Provider value={contextValues}>
      <OdsFormField
        className={`max-w-md ${className || ''}`}
        error={hasError ? errorMessage : undefined}
        role="group"
        data-fieldname={controller.field.name}
        aria-labelledby={id}
        aria-describedby={`helper-${id}`}
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
  const { id } = useRhfFieldContext();

  return (
    <OdsText
      id={`helper-${id}`}
      className={`ods-field-helper ${className ?? ''}`}
      slot="helper"
      preset="caption"
      {...rest}
    />
  );
};

export const RhfHelperAuto = ({
  helperMessage: customHelperMessage,
  ...rest
}: Readonly<
  Omit<React.ComponentProps<typeof OdsText>, 'children'> & {
    helperMessage?: string;
  }
>) => {
  const { helperMessage, controller } = useRhfFieldContext();

  if (!controller.fieldState.error) {
    return (
      <RhfHelper {...rest}>{customHelperMessage ?? helperMessage}</RhfHelper>
    );
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
RhfField.Quantity = RhfQuantity;
RhfField.Input = RhfInput;
