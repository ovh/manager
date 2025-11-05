import { useTranslation } from 'react-i18next';

import { Button } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/ObservabilityToCustomer.translations';

import DateTimePicker from './DateTimePicker.component';
import { TimeRangeSelectorProps } from './TimeRangeSelector.props';
import './time-controls.scss';

export const TimeRangeSelector: React.FC<Readonly<TimeRangeSelectorProps>> = ({
  startDateTime,
  endDateTime,
}): JSX.Element => {
  const { t } = useTranslation(NAMESPACES.TIME_CONTROLS);

  return (
    <div className="p-5 flex flex-col gap-4">
      <DateTimePicker
        id="time-range-date-picker-from"
        label={t('time_range_from')}
        defaultValue={startDateTime}
      />

      <DateTimePicker
        id="time-range-date-picker-to"
        label={t('time_range_to')}
        defaultValue={endDateTime}
      />

      <Button variant="default">{t('apply_time_range')}</Button>
    </div>
  );
};

export default TimeRangeSelector;
