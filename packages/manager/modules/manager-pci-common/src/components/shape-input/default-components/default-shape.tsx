import clsx from 'clsx';
import { ReactNode } from 'react';
import { GHOST_BUTTON_CLASS } from '../constants';
import {
  selectableTileClass,
  selectedTileClass,
  tileBorderClass,
  tileDisabledClass,
} from '../../../constants/style';

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
      'w-full h-full cursor-pointer',
      tileBorderClass,
      isDisabled && tileDisabledClass,
      isSelected ? selectedTileClass : selectableTileClass,
    )}
    onClick={() => {
      if (!isDisabled) action();
    }}
  >
    {children}
  </button>
);
