import { PhoneNumberControl as ODSPhoneNumberControl } from '@ovhcloud/ods-react';

import { PhoneNumberControlProps } from './PhoneNumberControl.props';

export const PhoneNumberControl = (props: PhoneNumberControlProps) => (
  <ODSPhoneNumberControl {...props} />
);
