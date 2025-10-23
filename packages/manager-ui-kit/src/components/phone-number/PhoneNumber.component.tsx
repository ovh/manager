import { PhoneNumber as OdsPhoneNumber } from '@ovhcloud/ods-react';

import { PhoneNumberProps } from '@/components';

export const PhoneNumber = ({ children, ...others }: PhoneNumberProps) => (
  <OdsPhoneNumber {...others}>{children}</OdsPhoneNumber>
);
