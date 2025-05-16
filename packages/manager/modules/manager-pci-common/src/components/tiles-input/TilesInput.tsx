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

export type TilesInputProps<T> = Pick<RadioFieldProps, 'label' | 'subtitle'> & {
  elements: T[];
  value: T | null;
  elementKey: (element: T) => KeyValue;
  onChange?: (value: T) => void;
  render: ComponentType<TilesInputRenderProps<T>>;
  inputProps?: (
    element: T,
  ) => Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange'
  >;
  name: string;
  locked?: boolean;
};

export const TilesInput = <
  T extends string | number | Record<string, unknown>
>({
  label,
  elements: elementsProps,
  elementKey,
  value: selectedValue,
  onChange,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  render: Renderer,
  inputProps,
  subtitle,
  locked,
  name,
}: TilesInputProps<T>) => {
  const selectedValueKey = useMemo(
    () => (selectedValue !== null ? elementKey(selectedValue) : null),
    [elementKey, selectedValue],
  );

  const elements = useMemo(() => {
    if (!locked) return elementsProps;

    if (selectedValue) return [selectedValue];

    return [];
  }, [elementsProps, selectedValue, locked]);

  return (
    <RadioField label={label} subtitle={subtitle} disabled={locked}>
      <div className="grid gap-6 p-6 m-0 grid-cols-1 md:grid-cols-3">
        {elements.map((element) => {
          const key = elementKey(element);
          return (
            <RadioAdapter
              name={name}
              key={key}
              value={key}
              checked={key === selectedValueKey}
              onChange={() => onChange?.(element)}
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
