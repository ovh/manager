import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface IRadioCard {
  id: string;
  name: string;
  selected: string;
  isDisabled?: boolean;
  children: ReactNode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioCard: FC<IRadioCard> = ({
  children,
  id,
  name,
  isDisabled,
  selected,
  onChange,
}) => {
  const isChecked = selected === id;

  return (
    <label
      key={id}
      htmlFor={id}
      className={clsx(
        'flex gap-2 p-3 border-solid rounded-md cursor-pointer border-2',
        isChecked ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400',
      )}
    >
      <input
        id={id}
        value={id}
        type="radio"
        name={name}
        checked={isChecked}
        onChange={onChange}
        className="self-start"
        disabled={isDisabled}
      />
      {children}
    </label>
  );
};
