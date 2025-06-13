import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useMemo,
} from 'react';
import { RadioFieldProps } from '@/components/input-adapter';
import { RadioField } from '@/components/input-adapter/radio-adapter/RadioField';
import {
  ConfigCard,
  ConfigCardElementProps,
} from '@/components/config-card/ConfigCard';

type KeyValue = string | number;

export type TilesInputProps<T extends ConfigCardElementProps> = Pick<
  RadioFieldProps,
  'label' | 'subtitle'
> & {
  elements: T[];
  value: T | null;
  elementKey?: (element: T) => KeyValue;
  onChange?: (value: T) => void;
  inputProps?: (
    element: T,
  ) => Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange'
  >;
  name: string;
  locked?: boolean;
};

export const TilesInput = <T extends ConfigCardElementProps>({
  label,
  elements: elementsProps,
  elementKey,
  value: selectedValue,
  onChange,
  inputProps,
  subtitle,
  locked,
  name,
}: TilesInputProps<T>) => {
  const getKey = useCallback(
    (element: T) => elementKey?.(selectedValue) ?? element.label,
    [elementKey],
  );

  const elements = useMemo(() => {
    if (!locked) return elementsProps;

    if (selectedValue) return [selectedValue];

    return [];
  }, [elementsProps, selectedValue, locked]);

  return (
    <RadioField label={label} subtitle={subtitle} disabled={locked}>
      <div className="grid gap-6 p-6 m-0 grid-cols-1 md:grid-cols-3 auto-rows-auto">
        {elements.map((element) => {
          const key = getKey(element);
          return (
            <ConfigCard
              key={key}
              inputProps={{
                name,
                type: 'radio',
                value: key,
                onChange: () => onChange?.(element),
                ...inputProps?.(element),
              }}
              {...element}
            />
          );
        })}
      </div>
    </RadioField>
  );
};
