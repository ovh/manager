import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import DateTimePicker from '@/components/timeControls/DateTimePicker.component';
import { TimeRangeSelectorProps } from '@/components/timeControls/TimeRangeSelector.props';

import '@/components/timeControls/time-controls.scss';

export const TimeRangeSelector: React.FC<Readonly<TimeRangeSelectorProps>> = ({
  startDateTime,
  endDateTime,
  onApply,
}): JSX.Element => {
  const { t } = useTranslation(NAMESPACES.TIME_CONTROLS);

  const [localStartDateTime, setLocalStartDateTime] = useState<number>(startDateTime);
  const [localEndDateTime, setLocalEndDateTime] = useState<number>(endDateTime);

  const onClickApply = () => {
    onApply(localStartDateTime, localEndDateTime);
  };

  return (
    <div className="px-2 pb-2 flex flex-col gap-4">
      <DateTimePicker
        id="time-range-date-picker-from"
        label={t('time_range_from')}
        defaultValue={startDateTime}
        onValueChange={(value: number) => setLocalStartDateTime(value)}
      />

      <DateTimePicker
        id="time-range-date-picker-to"
        label={t('time_range_to')}
        defaultValue={endDateTime}
        onValueChange={(value: number) => setLocalEndDateTime(value)}
      />
      <div className="flex justify-end">
        <Button
          variant={BUTTON_VARIANT.default}
          size={BUTTON_SIZE.sm}
          onClick={onClickApply}
          disabled={
            localStartDateTime === startDateTime &&
            localEndDateTime === endDateTime
          }
        >
          {t('apply_time_range')}
        </Button>
      </div>

    </div>
  );
};

export default TimeRangeSelector;
