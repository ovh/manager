import {
  ComponentType,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useId,
  useMemo,
} from 'react';
import clsx from 'clsx';

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

export type RadioAdapterFactory = ComponentType<RadioAdapterFactoryProps>;

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  render: Renderer,
  onChange: onChangeProp,
  className,
  ...inputProps
}: Readonly<RadioAdapterProps>) => {
  const labelId = useId();
  const ariaDetailsId = useId();

  const onChange = useCallback(() => onChangeProp(inputProps.value), [
    onChangeProp,
    inputProps.value,
  ]);

  const element = useMemo(
    () => (
      <Renderer
        name={name}
        checked={checked}
        labelId={labelId}
        ariaDetailsId={ariaDetailsId}
        onChange={onChange}
        {...inputProps}
      />
    ),
    [Renderer, name, checked, labelId, ariaDetailsId, inputProps],
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
        className={clsx('sr-only peer', className)}
        aria-labelledby={labelId}
        aria-details={ariaDetailsId}
      />
      {element}
    </label>
  );
};
