import React, { ChangeEventHandler, FC, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { OdsText } from '@ovhcloud/ods-components/react';

type RadioCardProps = {
  id: string;
  name: string;
  selected: string;
  isDisabled?: boolean;
  title: string | ReactElement;
  subTitle?: string | ReactElement;
  badges?: ReactElement;
  children?: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const RadioCard: FC<RadioCardProps> = ({
  children,
  id,
  name,
  isDisabled,
  title,
  subTitle,
  badges,
  selected,
  onChange,
}) => {
  const isChecked = selected === id;

  return (
    <label
      key={id}
      htmlFor={id}
      className={clsx(
        'flex gap-2 p-3 border-solid rounded-md border-2  ',
        !isDisabled && 'cursor-pointer ',
        !isChecked && 'border-[--ods-color-form-element-border-default]',
        !isChecked &&
          !isDisabled &&
          'hover:border-[--ods-color-form-element-border-hover-default]',
        isChecked && !isDisabled && 'border-[--ods-color-primary-500]',
        isDisabled &&
          'cursor-not-allowed grayscale opacity-70 bg-[--ods-color-background-disabled-default] border-[--ods-color-border-disabled-default]',
      )}
    >
      <div className="flex flex-col gap-3">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              data-testid={id}
              id={id}
              value={id}
              name={name}
              checked={isChecked}
              onChange={onChange}
              disabled={isDisabled}
              className="self-start"
            />
            <div className="flex gap-1 flex-wrap">
              <OdsText preset="heading-6">{title}</OdsText>
              {subTitle && <OdsText preset="span">{subTitle}</OdsText>}
            </div>
          </div>
          {badges}
        </div>
        {children}
      </div>
    </label>
  );
};
