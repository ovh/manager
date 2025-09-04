import React, { useState } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

export interface ObsTimeControlsProps {
  timeOptions?: string[];
  customTimeOptionHidden?: boolean;
  onValueChange?: (range: string) => void;
  defaultValue?: string;
}

export const ObsTimeControls = ({
  timeOptions = ['1h', '12h', '1d'],
  customTimeOptionHidden = false,
  onValueChange,
  defaultValue = '1h',
}: Readonly<ObsTimeControlsProps>): JSX.Element => {
  const [value, setValue] = useState(defaultValue);

  const handleClick = (range: string) => {
    setValue(range);
    onValueChange?.(range);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        {/* Time range buttons */}
        <div className="inline-flex">
          {timeOptions.map((range, index) => (
            <OdsButton
              key={range}
              onClick={() => handleClick(range)}
              label={range}
              variant={ODS_BUTTON_VARIANT.outline}
              iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
              className={`font-medium
                [&::part(button)]:w-20
                [&::part(button)]:rounded-none
                ${index === 0 ? '[&::part(button)]:rounded-s-md' : ''}
                [&::part(button)]:border-r-0
                ${
                  value === range
                    ? '[&::part(button)]:bg-[var(--ods-color-primary-200)] [&::part(button)]:text-initial'
                    : ''
                }
              `}
            ></OdsButton>
          ))}
          {!customTimeOptionHidden && (
            <OdsButton
              key={'time-option-custom'}
              onClick={() => handleClick('custom')}
              label={'Custom'}
              variant={ODS_BUTTON_VARIANT.outline}
              icon={ODS_ICON_NAME.calendar}
              iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
              className={`font-medium 
                [&::part(button)]:w-24
                [&::part(button)]:rounded-s-none
                ${
                  value === 'custom'
                    ? '[&::part(button)]:bg-[var(--ods-color-primary-200)] [&::part(button)]:text-initial'
                    : ''
                }
                `}
            ></OdsButton>
          )}
        </div>
      </div>
      <div>
        {/* Refresh button */}
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          label={'Refresh'}
          onClick={() => {}}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.left}
          icon={ODS_ICON_NAME.refresh}
        />
      </div>
    </div>
  );
};
