/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  PhoneNumberProp as OdsPhoneNumberProps,
  type PhoneNumberCountryChangeDetail,
  type PhoneNumberValueChangeDetail,
} from '@ovhcloud/ods-react';

export type PhoneNumberProps = PropsWithChildren<OdsPhoneNumberProps> & {};

export type { PhoneNumberCountryChangeDetail, PhoneNumberValueChangeDetail };
