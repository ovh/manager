import React, { useId } from 'react';

import { Control, FieldValues, Path, UseControllerProps, useController } from 'react-hook-form';

import { OdsComboboxItem, OdsFormField, OdsText } from '@ovhcloud/ods-components/react';

import { RhfCombobox } from '@/components/Fields/RhfCombobox.component';
import { RhfSelect } from '@/components/Fields/RhfSelect.component';

import { RhfFieldContext, RhfFieldContextParams, useRhfFieldContext } from './RhfField.context';
import { RhfInput } from './RhfInput.component';
import { RhfQuantity } from './RhfQuantity.component';

type RhfFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = React.ComponentProps<typeof OdsFormField> & {
  controllerParams: UseControllerProps<TFieldValues, TName>;
  helperMessage?: string;
  isHiddenError?: boolean;
  control: Control<TFieldValues, TName>;
};

export const RhfField = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  controllerParams,
  className,
  helperMessage,
  isHiddenError,
  control,
  ...rest
}: Readonly<RhfFieldProps<TFieldValues, TName>>) => {
  const id = useId();
  const controller = useController({ ...controllerParams, control });

  const contextValues = {
    id,
    helperMessage,
    controller,
  };

  const hasError = !isHiddenError && !!controller.fieldState?.error;
  const errorMessage = helperMessage || controller.fieldState?.error?.message;

  return (
    <RhfFieldContext.Provider value={contextValues as unknown as RhfFieldContextParams}>
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

  if (controller?.fieldState.error) {
    return null;
  }

  return <RhfHelper {...rest}>{customHelperMessage ?? helperMessage}</RhfHelper>;
};

export const RhfVisualHintCounter = ({
  max,
  ...rest
}: Readonly<React.ComponentProps<typeof OdsText> & { max: string | number }>) => {
  const { controller } = useRhfFieldContext();

  return (
    <RhfVisualHint {...rest}>
      {(controller?.field.value as [])?.length ?? 0}/{max}
    </RhfVisualHint>
  );
};

RhfField.Label = RhfLabel;
RhfField.VisualHint = RhfVisualHint;
RhfField.VisualHintCounter = RhfVisualHintCounter;
RhfField.Helper = RhfHelper;
RhfField.HelperAuto = RhfHelperAuto;
RhfField.Combobox = RhfCombobox;
RhfField.ComboboxItem = OdsComboboxItem;
RhfField.Select = RhfSelect;
RhfField.Quantity = RhfQuantity;
RhfField.Input = RhfInput;
