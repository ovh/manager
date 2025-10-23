import { TimepickerControl as ODSTimepickerControl } from '@ovhcloud/ods-react';

import { TimepickerControlProps } from './TimepickerControl.props';

export const TimepickerControl = (props: TimepickerControlProps) => (
  <ODSTimepickerControl {...props} />
);
