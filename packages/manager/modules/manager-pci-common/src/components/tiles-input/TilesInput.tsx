import {
  ComponentType,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useMemo,
} from 'react';
import {
  RadioAdapter,
  RadioAdapterFactoryProps,
  RadioFieldProps,
} from '@/components/input-adapter';
import { RadioField } from '@/components/input-adapter/radio-adapter/RadioField';

type KeyValue = string | number;

export type TilesInputRenderProps<T> = RadioAdapterFactoryProps & {
  element: T;
};

export type TilesInputProps<T> = {
  elements: T[];
  value: T | null;
  elementKey: (element: T) => KeyValue;
  onChange: (value: T) => void;
  render: ComponentType<TilesInputRenderProps<T>>;
  inputProps?: (
    element: T,
  ) => Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange'
  >;
  name: string;
} & Omit<RadioFieldProps, 'children'>;

export const TilesInput = <
  T extends string | number | Record<string, unknown>
>({
  label,
  elements,
  elementKey,
  value: selectedValue,
  onChange,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  render: Renderer,
  inputProps,
  subtitle,
  ...radioAdapterProps
}: TilesInputProps<T>) => {
  const selectedValueKey = useMemo(
    () => (selectedValue !== null ? elementKey(selectedValue) : null),
    [elementKey, selectedValue],
  );

  return (
    <RadioField label={label} subtitle={subtitle}>
      <div className="grid gap-6 p-6 m-0 grid-cols-1 md:grid-cols-3">
        {elements.map((element) => {
          const key = elementKey(element);
          return (
            <RadioAdapter
              {...radioAdapterProps}
              key={key}
              value={key}
              checked={key === selectedValueKey}
              onChange={() => onChange(element)}
              render={(adapterProps) => (
                <Renderer {...adapterProps} element={element} />
              )}
              {...inputProps?.(element)}
            />
          );
        })}
      </div>
    </RadioField>
  );
};
