import clsx from 'clsx';

import { Text } from '@ovh-ux/muk';

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
  const isChecked = Boolean(selected && selected === id);

  return (
    <label
      key={id}
      htmlFor={id}
      className={clsx(
        'flex rounded-md border border-solid px-5 py-6',
        !isDisabled && 'cursor-pointer',
        !isChecked && 'border-[--ods-color-form-element-border-default]',
        !isChecked && !isDisabled && 'hover:border-[--ods-color-form-element-border-hover-default]',
        isChecked &&
          !isDisabled &&
          'border-[--ods-color-primary-500] bg-[--ods-color-primary-050] outline outline-1 outline-[--ods-color-primary-500]',
        isDisabled &&
          'cursor-not-allowed border-[--ods-color-border-disabled-default] bg-[--ods-color-background-disabled-default] opacity-70 grayscale',
      )}
    >
      <div className="flex flex-row gap-3">
        {/* HEADER */}
        <div className="flex flex-1 flex-col gap-1">
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
              className="m-0 accent-[--ods-color-primary-500]"
            />
            <Text preset="heading-6">{title}</Text>
            {subTitle && <Text preset="span">{subTitle}</Text>}
            {badges && <span>{badges}</span>}
          </div>
        </div>
        {/* BODY */}
        {children}
      </div>
    </label>
  );
};
