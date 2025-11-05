import {
  Datepicker,
  DatepickerContent,
  DatepickerControl,
  FormField,
  FormFieldLabel,
  Timepicker,
  TimepickerControl,
} from '@ovhcloud/ods-react';

import { formatTimeFromDate } from '@/utils/dateTimeUtils';

interface DateTimePickerProps {
  id: string;
  label: string;
  defaultValue?: number;
}

export const DateTimePicker: React.FC<Readonly<DateTimePickerProps>> = ({
  id,
  label,
  defaultValue,
}): JSX.Element => {
  const defaultDate = defaultValue ? new Date(defaultValue) : new Date();
  const defaultTime = formatTimeFromDate(defaultDate);

  return (
    <FormField>
      <FormFieldLabel>{label}</FormFieldLabel>
      <div className="inline-flex gap-4">
        <Datepicker id={id} defaultValue={defaultDate}>
          <DatepickerControl />
          <DatepickerContent />
        </Datepicker>
        <Timepicker withSeconds={true} defaultValue={defaultTime}>
          <TimepickerControl />
        </Timepicker>
      </div>
    </FormField>
  );
};

export default DateTimePicker;
