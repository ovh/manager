import React, { ChangeEventHandler, ReactElement, ReactNode } from 'react';
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

export const RadioCard = ({
  children,
  id,
  name,
  isDisabled,
  title,
  subTitle,
  badges,
  selected,
  onChange,
}: RadioCardProps) => {
  const isChecked = selected === id;

  return (
    <label
      key={id}
      htmlFor={id}
      className={clsx(
        'flex border-solid rounded-md border px-3 py-4',
        !isDisabled && 'cursor-pointer',
        !isChecked && 'border-[--ods-color-form-element-border-default]',
        !isChecked &&
          !isDisabled &&
          'hover:border-[--ods-color-form-element-border-hover-default]',
        isChecked &&
          !isDisabled &&
          'border-[--ods-color-primary-500] bg-[--ods-color-primary-050] outline outline-1 outline-[--ods-color-primary-500]',
        isDisabled &&
          'cursor-not-allowed grayscale opacity-70 bg-[--ods-color-background-disabled-default] border-[--ods-color-border-disabled-default]',
      )}
    >
      <div className="flex flex-col gap-3">
        {/* HEADER */}
        <div className="flex gap-3 items-center">
          <input
            type="radio"
            data-testid={id}
            id={id}
            value={id}
            name={name}
            checked={isChecked}
            onChange={onChange}
            disabled={isDisabled}
            className="m-0"
          />
          <div className="flex flex-wrap items-center gap-y-1">
            <OdsText preset="heading-6" className="mr-1">
              {title}
            </OdsText>
            {subTitle && (
              <OdsText preset="span" className="mr-2">
                {subTitle}
              </OdsText>
            )}
            {badges && <span>{badges}</span>}
          </div>
        </div>
        {/* BODY */}
        {children}
      </div>
    </label>
  );
};
