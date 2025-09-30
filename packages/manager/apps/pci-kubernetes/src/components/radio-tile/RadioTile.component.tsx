import { InputHTMLAttributes, KeyboardEvent, ReactNode, useId } from 'react';

import { cn } from '@/helpers';

interface RadioTileProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode | ReactNode[];
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
  const handleLabelKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputElement = document.getElementById(id) as HTMLInputElement | null;
      if (inputElement) {
        inputElement.click();
      }
    }
  };
  return (
    <div
      role="radio"
      aria-checked={props.checked}
      {...(!disabled && { tabIndex: 0 })}
      onKeyDown={handleLabelKeyDown}
      data-testid="radio-tile-container"
      className={cn(tileClassName, 'h-full')}
    >
      <div className="h-full">
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
            'flex flex-col h-full w-full group border-2 border-solid  rounded-md',
            {
              'border-[--ods-color-blue-600]  selected': !disabled && props.checked,
              'border-[--ods-color-blue-100] bg-white': !disabled && !props.checked,
              'hover:shadow-sm  hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600] cursor-pointer':
                !disabled,
              'bg-neutral-100  text-neutral-800 border-[--ods-color-border-readonly-default]':
                disabled,
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

export default RadioTile;
