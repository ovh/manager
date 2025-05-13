import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import {
  selectableTileClass,
  selectedTileClass,
  tileBorderClass,
  tileDisabledClass,
} from '../../constants/style';

export interface TileChoiceProps {
  isSelected?: boolean;
  isDisabled?: boolean;
}
export function TileChoice({
  children,
  isSelected,
  isDisabled,
}: PropsWithChildren<TileChoiceProps>) {
  return (
    <div
      className={clsx(
        'cursor-pointer text-left w-full h-full',
        tileBorderClass,
        isDisabled && tileDisabledClass,
        isSelected ? selectedTileClass : selectableTileClass,
      )}
    >
      <div className="m-6">{children}</div>
    </div>
  );
}
