import { Datepicker as OdsDatepicker } from '@ovhcloud/ods-react';

import { DatepickerProps } from '@/components';

export const Datepicker = ({ children, ...others }: DatepickerProps) => (
  <OdsDatepicker {...others}>{children}</OdsDatepicker>
);
