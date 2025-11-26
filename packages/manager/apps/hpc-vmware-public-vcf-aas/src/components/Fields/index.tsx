import React, { useId } from 'react';

import clsx from 'clsx';
import { Control, FieldValues, UseControllerProps, useController } from 'react-hook-form';

import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';

import { RhfFieldContext, useRhfFieldContext } from './RhfField.context';
import { RhfInput } from './RhfInput.component';
import { RhfQuantity } from './RhfQuantity.component';

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

  const contextValues = { id, helperMessage, controller };

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

export const RhfLabel = (props: Readonly<React.LabelHTMLAttributes<HTMLLabelElement>>) => {
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
      className={clsx('[&::part(text)]:w-full [&::part(text)]:text-start', className)}
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
    return <RhfHelper {...rest}>{customHelperMessage ?? helperMessage}</RhfHelper>;
  }

  return <></>;
};

export const RhfVisualHintCounter = ({
  max,
  ...rest
}: Readonly<React.ComponentProps<typeof OdsText> & { max: string | number }>) => {
  const {
    controller: { field },
  } = useRhfFieldContext();

  return (
    <RhfVisualHint {...rest}>
      {(field.value as string)?.length ?? 0}/{max}
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
