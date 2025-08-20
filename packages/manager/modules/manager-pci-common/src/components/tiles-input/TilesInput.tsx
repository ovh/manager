import { ComponentProps, useCallback, useMemo } from 'react';
import { RadioFieldProps } from '@/components/input-adapter';
import { RadioField } from '@/components/input-adapter/radio-adapter/RadioField';
import {
  ConfigCard,
  ConfigCardElementProps,
} from '@/components/config-card/ConfigCard';
import './style.scss';

type KeyValue = string | number;

export type TilesInputProps<
  T extends ConfigCardElementProps = ConfigCardElementProps
> = Pick<RadioFieldProps, 'label' | 'subtitle'> & {
  elements: T[];
  value: T | null;
  elementKey?: (element: T) => KeyValue;
  onChange?: (value: T) => void;
  inputProps?: (element: T) => ComponentProps<'input'>;
  name: string;
  locked?: boolean;
  horizontal?: boolean;
};

export const TilesInput = <
  T extends ConfigCardElementProps = ConfigCardElementProps
>({
  label,
  elements: elementsProps,
  elementKey,
  value: selectedValue,
  onChange,
  inputProps,
  subtitle,
  locked,
  name,
  horizontal,
}: TilesInputProps<T>) => {
  const getKey = useCallback(
    (element: T) => elementKey?.(selectedValue) ?? element.label,
    [elementKey],
  );

  const selectedValueKey = useMemo(
    () => (selectedValue ? getKey(selectedValue) : null),
    [selectedValue, getKey],
  );

  const elements = useMemo(() => {
    if (!locked) return elementsProps;

    if (selectedValue) return [selectedValue];

    return [];
  }, [elementsProps, selectedValue, locked]);

  return (
    <RadioField label={label} subtitle={subtitle} disabled={locked}>
      <div
        className={`pci-tiles-input-grid pci-tiles-input-grid-${
          horizontal ? 'horizontal' : 'vertical'
        }`}
      >
        {elements.map((element) => {
          const key = getKey(element);
          return (
            <ConfigCard
              key={key}
              inputProps={{
                name,
                type: 'radio',
                value: key,
                checked: key === selectedValueKey,
                onChange: () => onChange?.(element),
                ...inputProps?.(element),
              }}
              horizontal={horizontal}
              {...element}
            />
          );
        })}
      </div>
    </RadioField>
  );
};
