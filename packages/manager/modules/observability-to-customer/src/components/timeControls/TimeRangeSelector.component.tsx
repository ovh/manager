import { useTranslation } from 'react-i18next';

import { Button } from '@ovhcloud/ods-react';

import DateTimePicker from './DateTimePicker.component';
import { TimeRangeSelectorProps } from './TimeRangeSelector.props';
import './time-controls.scss';

export const TimeRangeSelector: React.FC<Readonly<TimeRangeSelectorProps>> = ({
  startDateTime,
  endDateTime,
}): JSX.Element => {
  const { t } = useTranslation('observability-timeControls');

  return (
    <div className="p-5 flex flex-col gap-4">
      <DateTimePicker
        id="time-range-date-picker-from"
        label={t('time-controls-time-range-from')}
        defaultValue={startDateTime}
      />

      <DateTimePicker
        id="time-range-date-picker-to"
        label={t('time-controls-time-range-to')}
        defaultValue={endDateTime}
      />

      <Button variant="default">{t('time-controls-apply-time-range')}</Button>
    </div>
  );
};

export default TimeRangeSelector;
