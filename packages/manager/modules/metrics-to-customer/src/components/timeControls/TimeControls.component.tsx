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
  PopoverOpenChangeDetail,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';
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
  onRefresh,
  onCancel,
}): JSX.Element => {
  const { t } = useTranslation(NAMESPACES.TIME_CONTROLS);

  const [value, setValue] = useState<string>(defaultValue);

  const { startDateTime, endDateTime } = state;

  const handleClick = (range: TimeRangeOptionWithLabel) => {
    setValue(range.value);
    onStateChange<TimeRangeOption>('selectedTimeOption', range);
  };

  const [isDateRangePopoverOpen, setIsDateRangePopoverOpen] = useState<boolean>(false);

  const closeDateRangePopover = () => {
    setIsDateRangePopoverOpen(false);
  };

  const onApplyTimeRange = (startDateTime: number, endDateTime: number) => {
    onStateChange('dateRange', {
      startDateTime,
      endDateTime,
    });
    closeDateRangePopover();
  };

  return (
    <div className='flex items-start gap-4'>
      <div className='flex flex-col gap-2'>
        <div className="flex items-center space-x-2">
          <div className="inline-flex">
            {timeOptions.map((range: TimeRangeOptionWithLabel, index: number) => (
              <Button
                key={range.value}
                onClick={() => handleClick(range)}
                variant={BUTTON_VARIANT.outline}
                className={`font-medium
                w-auto
                rounded-none
                ${index === 0 ? 'rounded-s-md' : ''}
                border-r-0
                ${value === range.value ? 'bg-[var(--ods-color-primary-200)] text-initial' : ''}
              `}
              >
                {t(range.label)}
              </Button>
            ))}
            {!customTimeOptionHidden && (
              <Popover position={POPOVER_POSITION.bottomEnd}
                open={isDateRangePopoverOpen}
                onOpenChange={(detail: PopoverOpenChangeDetail) => setIsDateRangePopoverOpen(detail.open)} >
                <PopoverTrigger asChild className="z-40">
                  <Button
                    key={'time-option-custom'}
                    onClick={() => handleClick(TimeRangeOptionCustom)}
                    variant={BUTTON_VARIANT.outline}
                    className={`font-medium w-auto rounded-s-none
                      ${value === 'custom' ? 'bg-[var(--ods-color-primary-700)] text-white' : ''}
                    `}
                  >
                    <span>{t('option_custom')}</span>
                    <Icon name={ICON_NAME.calendar} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <TimeRangeSelector
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                    onApply={onApplyTimeRange}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
      <div>
        <RefreshTimeControl
          isLoading={isLoading}
          defaultRefreshInterval={state.refreshInterval}
          onStateChange={onStateChange}
          onRefresh={onRefresh}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default TimeControls;
