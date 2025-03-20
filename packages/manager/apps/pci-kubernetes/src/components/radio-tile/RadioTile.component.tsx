import { useId } from 'react';
import { cn } from '@/helpers';

interface RadioTileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  tileClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}
const RadioTile = ({
  children,
  labelClassName,
  disabled = false,
  tileClassName,
  ...props
}: RadioTileProps) => {
  const id = useId();
  const labelId = `${id}-label`;
  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputElement = document.getElementById(
        id,
      ) as HTMLInputElement | null;
      if (inputElement) {
        inputElement.click();
      }
    }
  };
  return (
    <div
      role="radio"
      aria-checked={props.checked}
      tabIndex={!disabled ? 0 : undefined}
      onKeyDown={handleLabelKeyDown}
      data-testid="radio-tile-container"
    >
      <div className={cn(tileClassName)}>
        <input
          onChange={(e) => (props.onChange ? props.onChange(e) : null)}
          className="hidden"
          type="radio"
          id={id}
          aria-disabled={disabled}
          aria-labelledby={labelId}
          checked={props.checked}
          {...props}
        />
        <label
          id={labelId}
          className={cn(
            'flex flex-col  h-full w-full group text-primary-400 border-2 border-primary-100 rounded-md',
            {
              'border-primary-600  selected': !disabled && props.checked,
              'border-primary-100 bg-white': !disabled && !props.checked,
              'hover:shadow-sm hover:border-primary-600 hover:bg-primary-100 cursor-pointer': !disabled,
              'bg-neutral-100 border-neutral-100 text-neutral-800': disabled,
            },

            labelClassName,
          )}
          htmlFor={id}
          data-testid="radio-tile-label"
        >
          {children}
        </label>
      </div>
    </div>
  );
};

RadioTile.Separator = function RadioTileSeparator() {
  return (
    <div
      className="w-full border-neutral-100 border-t mt-2 pt-2 "
      aria-hidden="true"
    ></div>
  );
};

export default RadioTile;
