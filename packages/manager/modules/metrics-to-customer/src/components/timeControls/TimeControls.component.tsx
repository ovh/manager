import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ButtonGroup,
  ButtonGroupItem,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverOpenChangeDetail,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { TimeRangeOptionCustom, defaultTimeRangeOptions } from '@/constants/timeControls/TimeRangeOption.constants';

import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import { TimeRangeOptionWithLabel } from '@/types/timeControls/TimeRangeOptionWithLabel.type';

import RefreshTimeControl from '@/components/timeControls/RefreshTimeControl.component';
import { TimeControlsProps } from '@/components/timeControls/TimeControls.props';
import TimeRangeSelector from '@/components/timeControls/TimeRangeSelector.component';

export const TimeControls: React.FC<Readonly<TimeControlsProps>> = ({
  id,
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
          <ButtonGroup value={[state.selectedTimeOption.value]}>
            {timeOptions.map((range: TimeRangeOptionWithLabel, index: number) => (
              <ButtonGroupItem
                key={`${range.value}_${index}`}
                value={range.value}
                onClick={() => handleClick(range)}
              >
                {t(range.label)}
              </ButtonGroupItem>
            ))}

            {
              !customTimeOptionHidden && <Popover position={POPOVER_POSITION.bottomEnd}
                open={isDateRangePopoverOpen}
                onOpenChange={(detail: PopoverOpenChangeDetail) => setIsDateRangePopoverOpen(detail.open)} >
                <PopoverTrigger asChild className="z-40">
                  <ButtonGroupItem value="custom"
                    onClick={() => handleClick(TimeRangeOptionCustom)}
                  >
                    <Icon name={ICON_NAME.calendar} />
                    {t('option_custom')}
                  </ButtonGroupItem>
                </PopoverTrigger>
                <PopoverContent>
                  <TimeRangeSelector
                    id={id}
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                    onApply={onApplyTimeRange}
                  />
                </PopoverContent>
              </Popover>
            }
          </ButtonGroup>
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
