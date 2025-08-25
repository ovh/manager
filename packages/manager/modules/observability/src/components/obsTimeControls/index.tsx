import React, { useState } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

export const ObsTimeControls = (): JSX.Element => {
  const [selectedRange, setSelectedRange] = useState('1h');

  const timeRanges = ['1h', '12h', '1d', 'custom'];
  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Time range buttons */}
        <div className="inline-flex">
          {timeRanges.map((range) => (
            <OdsButton
              key={range}
              onClick={() => setSelectedRange(range)}
              label={range}
              variant={ODS_BUTTON_VARIANT.outline}
              {...(range === 'custom' ? { icon: ODS_ICON_NAME.calendar } : {})}
              iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
              className={`text-blue-500 font-medium
                                ${
                                  selectedRange === range
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white'
                                }`}
            ></OdsButton>
          ))}
        </div>
      </div>
      <div>
        {/* Refresh button */}
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          label={'refresh'}
          onClick={() => {}}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.left}
          icon={ODS_ICON_NAME.refresh}
        />
      </div>
    </>
  );
};
