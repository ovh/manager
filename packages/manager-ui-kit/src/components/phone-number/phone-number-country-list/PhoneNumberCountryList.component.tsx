import { PhoneNumberCountryList as ODSPhoneNumberCountryList } from '@ovhcloud/ods-react';

import { PhoneNumberCountryListProps } from './PhoneNumberCountryList.props';

export const PhoneNumberCountryList = (props: PhoneNumberCountryListProps) => (
  <ODSPhoneNumberCountryList {...props} />
);
