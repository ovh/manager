import { PhoneNumber as OdsPhoneNumber } from '@ovhcloud/ods-react';

import { PhoneNumberProps } from '@/components/phone-number/PhoneNumber.props';

export const PhoneNumber = ({ children, ...others }: PhoneNumberProps) => (
  <OdsPhoneNumber {...others}>{children}</OdsPhoneNumber>
);
