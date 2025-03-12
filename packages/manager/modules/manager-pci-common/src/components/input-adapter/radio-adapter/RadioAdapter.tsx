import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useId,
  useMemo,
} from 'react';

export type RadioAdapterFactoryProps = {
  name: string;
  checked?: boolean;
  labelId: string;
  ariaDetailsId: string;
  onChange: (value: InputHTMLAttributes<HTMLInputElement>['value']) => void;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
>;

export type RadioAdapterFactory = (
  inputProperties: RadioAdapterFactoryProps,
) => JSX.Element;

export type RadioAdapterProps = {
  name: string;
  checked?: boolean;
  render: RadioAdapterFactory;
  onChange: (value: InputHTMLAttributes<HTMLInputElement>['value']) => void;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
>;

export const RadioAdapter = ({
  name,
  checked,
  render,
  onChange: onChangeProp,
  ...inputProps
}: Readonly<RadioAdapterProps>) => {
  const labelId = useId();
  const ariaDetailsId = useId();

  const onChange = useCallback(() => onChangeProp(inputProps.value), [
    onChangeProp,
    inputProps.value,
  ]);

  const element = useMemo(
    () =>
      render({
        name,
        checked,
        labelId,
        ariaDetailsId,
        onChange,
        ...inputProps,
      }),
    [render, name, checked, labelId, ariaDetailsId, inputProps],
  );

  return (
    <label className="tile-input">
      <input
        {...inputProps}
        tabIndex={0}
        onChange={onChange}
        type="radio"
        name={name}
        checked={checked}
        className="sr-only"
        aria-labelledby={labelId}
        aria-details={ariaDetailsId}
      />
      {element}
    </label>
  );
};
