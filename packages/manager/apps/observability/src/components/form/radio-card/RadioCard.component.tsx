import clsx from 'clsx';

import { OdsText } from '@ovhcloud/ods-components/react';

import { RadioCardProps } from '@/components/form/radio-card/RadioCard.props';

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
        'flex border-solid rounded-md border px-5 py-6',
        !isDisabled && 'cursor-pointer',
        !isChecked && 'border-[--ods-color-form-element-border-default]',
        !isChecked && !isDisabled && 'hover:border-[--ods-color-form-element-border-hover-default]',
        isChecked &&
          !isDisabled &&
          'border-[--ods-color-primary-500] bg-[--ods-color-primary-050] outline outline-1 outline-[--ods-color-primary-500]',
        isDisabled &&
          'cursor-not-allowed grayscale opacity-70 bg-[--ods-color-background-disabled-default] border-[--ods-color-border-disabled-default]',
      )}
    >
      <div className="flex flex-row gap-3">
        {/* HEADER */}
        <div className="flex flex-col flex-1 gap-1">
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
              className="m-0"
            />
            <OdsText preset="heading-6">{title}</OdsText>
            {badges && <span>{badges}</span>}
          </div>
          {subTitle && (
            <div>
              <OdsText preset="span">{subTitle}</OdsText>
            </div>
          )}
        </div>
        {/* BODY */}
        {children}
      </div>
    </label>
  );
};
