import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/ObservabilityToCustomer.translations';
import { TimeRangeOption } from '@/types/TimeRangeOption.type';

import RefreshTimeControl from './RefreshTimeControl.component';
import { TimeControlsProps } from './TimeControls.props';
import { TimeRangeOptionCustom, defaultTimeRangeOptions } from './TimeRangeOption.constants';
import { TimeRangeOptionWithLabel } from './TimeRangeOptionWithLabel.type';
import TimeRangeSelector from './TimeRangeSelector.component';

export const TimeControls: React.FC<Readonly<TimeControlsProps>> = ({
  timeOptions = defaultTimeRangeOptions,
  customTimeOptionHidden = false,
  isLoading,
  state,
  onStateChange,
  defaultValue = '1h',
}): JSX.Element => {
  const { t } = useTranslation(NAMESPACES.TIME_CONTROLS);

  const [value, setValue] = useState(defaultValue);

  const handleClick = (range: TimeRangeOptionWithLabel) => {
    setValue(range.value);
    if (range.value !== 'custom') {
      onStateChange<TimeRangeOption>('selectedTimeOption', range);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <div className="inline-flex">
          {timeOptions.map((range: TimeRangeOptionWithLabel, index: number) => (
            <Button
              key={range.value}
              onClick={() => handleClick(range)}
              variant={BUTTON_VARIANT.outline}
              className={`font-medium
                w-20
                rounded-none
                ${index === 0 ? 'rounded-s-md' : ''}
                border-r-0
                ${value === range.value ? 'bg-[var(--ods-color-primary-100)] text-initial' : ''}
              `}
            >
              {t(range.label)}
            </Button>
          ))}
          {!customTimeOptionHidden && (
            <Popover position={POPOVER_POSITION.bottomEnd}>
              <PopoverTrigger asChild className="z-40">
                <Button
                  key={'time-option-custom'}
                  onClick={() => handleClick(TimeRangeOptionCustom)}
                  variant={BUTTON_VARIANT.outline}
                  className={`font-medium w-auto rounded-s-none
                      ${value === 'custom' ? 'bg-[var(--ods-color-primary-200)] text-initial' : ''}
                    `}
                >
                  <span>{t('option_custom')}</span>
                  <Icon name={ICON_NAME.calendar} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <TimeRangeSelector
                  startDateTime={state.startDateTime}
                  endDateTime={state.endDateTime}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <div>
        <RefreshTimeControl
          isLoading={isLoading}
          defaultRefreshInterval={state.refreshInterval}
          onStateChange={onStateChange}
        />
      </div>
    </div>
  );
};

export default TimeControls;
