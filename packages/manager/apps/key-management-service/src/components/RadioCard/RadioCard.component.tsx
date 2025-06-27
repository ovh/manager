import React, { FC, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import {
  OdsRadioChangeEventDetail,
  OdsRadioCustomEvent,
} from '@ovhcloud/ods-components';

interface IRadioCard {
  id: string;
  name: string;
  selected: string;
  isDisabled?: boolean;
  title: string | ReactElement;
  subTitle?: string | ReactElement;
  badges?: ReactElement;
  children?: ReactNode;
  onChange: (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => void;
}

export const RadioCard: FC<IRadioCard> = ({
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
        !isChecked && 'border-gray-300',
        !isChecked && !isDisabled && 'hover:border-gray-400',
        isChecked && !isDisabled && 'border-blue-500',
        isDisabled && 'cursor-not-allowed grayscale opacity-70 bg-gray-100',
      )}
    >
      <div className="flex flex-col gap-3">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <OdsRadio
              inputId={id}
              value={id}
              name={name}
              isChecked={isChecked}
              onOdsChange={onChange}
              isDisabled={isDisabled}
            />
            <div className="flex gap-1 flex-wrap">
              <OdsText preset="heading-6">{title}</OdsText>
              {subTitle && <OdsText preset="span">{subTitle}</OdsText>}
            </div>
          </div>
          <>{badges}</>
        </div>
        {children}
      </div>
    </label>
  );
};
