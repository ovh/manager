import clsx from 'clsx';
import { ReactNode } from 'react';
import { GHOST_BUTTON_CLASS } from '../constants';

export const DefaultShapeComponent = ({
  isSelected,
  isDisabled,
  action,
  children,
}: {
  isSelected: boolean;
  isDisabled: boolean;
  action: () => void;
  children: ReactNode | ReactNode[];
}): JSX.Element => (
  <button
    className={clsx(
      GHOST_BUTTON_CLASS,
      'w-full h-full border-solid border-2 rounded-lg cursor-pointer',
      isDisabled && 'cursor-not-allowed pointer-events-none opacity-50',
      isSelected
        ? 'border-[--ods-color-blue-600] !bg-[--ods-color-blue-100]'
        : 'bg-white border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]',
    )}
    onClick={() => {
      if (!isDisabled) action();
    }}
  >
    {children}
  </button>
);
