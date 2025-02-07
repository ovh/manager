import { ODS_LOCALE } from '@ovhcloud/ods-common-core';

const getLocaleForDatePicker = (localeCode: string) => {
  switch (localeCode) {
    case 'enGB':
      return ODS_LOCALE.EN;
    case 'fr':
    case 'frCA':
      return ODS_LOCALE.FR;
    case 'it':
      return ODS_LOCALE.IT;
    case 'de':
      return ODS_LOCALE.DE;
    case 'pl':
      return ODS_LOCALE.PL;
    case 'es':
      return ODS_LOCALE.ES;
    case 'pt':
      return ODS_LOCALE.PT;
    default:
      return ODS_LOCALE.EN;
  }
};

export default getLocaleForDatePicker;
