import { Datepicker as OdsDatepicker } from '@ovhcloud/ods-react';

import { DatepickerProps } from '@/components/datepicker/Datepicker.props';

export const Datepicker = ({ children, ...others }: DatepickerProps) => (
  <OdsDatepicker {...others}>{children}</OdsDatepicker>
);
