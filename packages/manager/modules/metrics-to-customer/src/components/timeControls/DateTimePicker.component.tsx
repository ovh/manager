import { useMemo, useState } from 'react';

import { formatDate } from 'date-fns';

import {
  Datepicker,
  DatepickerContent,
  DatepickerControl,
  DatepickerValueChangeDetail,
  FormField,
  FormFieldLabel,
  Locale,
  Timepicker,
  TimepickerControl,
  TimepickerValueChangeDetail,
} from '@ovhcloud/ods-react';

import { useDateFnsLocale } from '@ovh-ux/muk';

import { calculateTimestamp } from '@/utils/dateTimeUtils';

import { DateTimePickerProps } from '@/components/timeControls/DateTimePicker.props';

export const DateTimePicker: React.FC<Readonly<DateTimePickerProps>> = ({
  id,
  label,
  defaultValue,
  onValueChange,
}): JSX.Element => {

  const dateFnsLocale = useDateFnsLocale();
  const locale = dateFnsLocale.code as Locale;

  const defaultDate = useMemo(() => {
    return defaultValue ? new Date(defaultValue * 1000) : new Date();
  }, [defaultValue]);

  const defaultTime = useMemo(() => {
    return formatDate(defaultDate, 'HH:mm:ss');
  }, [defaultDate]);

  const [currentTime, setCurrentTime] = useState<string>(defaultTime);
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);

  const onDateValueChange = (detail: DatepickerValueChangeDetail) => {
    const newDate = detail.value;
    if (newDate) {
      setCurrentDate(newDate);
      const newDateTimestamp = calculateTimestamp(newDate, currentTime);
      onValueChange(newDateTimestamp);
    }
  };

  const onTimeValueChange = (detail: TimepickerValueChangeDetail) => {
    const newTime = detail.value;
    setCurrentTime(newTime);
    const newDateTimeTimestamp = calculateTimestamp(currentDate, newTime);
    onValueChange(newDateTimeTimestamp);
  };

  return (
    <FormField>
      <FormFieldLabel>{label}</FormFieldLabel>
      <div className="inline-flex gap-2">
        <Datepicker
          positionerStyle={{
            zIndex: 100
          }}
          id={`datepicker-${id}`}
          className="w-40"
          defaultValue={defaultDate}
          onValueChange={onDateValueChange}
          locale={locale}
        >
          <DatepickerControl  />
          <DatepickerContent createPortal={false} style={{position: "relative"}} />
        </Datepicker>
        <Timepicker
          id={`timepicker-${id}`}
          withSeconds={true}
          defaultValue={defaultTime}
          onValueChange={onTimeValueChange}
          locale={locale}
        >
          <TimepickerControl className="w-34" />
        </Timepicker>
      </div>
    </FormField>
  );
};

export default DateTimePicker;
