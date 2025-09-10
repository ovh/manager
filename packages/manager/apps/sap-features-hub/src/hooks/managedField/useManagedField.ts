import {
  OdsInputChangeEventDetail,
  OdsSelectChangeEventDetail,
} from '@ovhcloud/ods-components';
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';

// --- Generic field hook ---
type TUseManagedFieldParams<TFormData extends FieldValues, TEvent = unknown> = {
  name: FieldPath<TFormData>;
  control: Control<TFormData>;
  extraHandler?: (event: TEvent) => void;
  valueAsNumber?: boolean;
};

type TUseManagedFieldEvent = CustomEvent<
  OdsInputChangeEventDetail | OdsSelectChangeEventDetail
>;

const useManagedField = <
  TFormData extends FieldValues,
  TEvent extends TUseManagedFieldEvent
>({
  name,
  control,
  extraHandler,
  valueAsNumber,
}: TUseManagedFieldParams<TFormData, TEvent>): ControllerRenderProps<
  TFormData,
  FieldPath<TFormData>
> => {
  const { field } = useController({ name, control });

  return {
    ...field,
    onChange: (event: TEvent) => {
      const { value } = event.detail;
      const isValueDefined = value !== null && value !== undefined;

      field.onChange(valueAsNumber && isValueDefined ? Number(value) : value);
      extraHandler?.(event);
    },
  };
};

// --- Select-specific field hook ---
export const useManagedSelectField = <TFormData extends FieldValues>(
  params: TUseManagedFieldParams<
    TFormData,
    CustomEvent<OdsSelectChangeEventDetail>
  >,
): ControllerRenderProps<TFormData, FieldPath<TFormData>> =>
  useManagedField(params);
