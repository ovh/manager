import { useMemo } from 'react';
import { ODS_LOCALE } from '@ovhcloud/ods-common-core';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';

const useLocaleForDatePicker = () => {
  const dateFnsLocale = useDateFnsLocale();

  return useMemo(() => {
    switch (dateFnsLocale.code) {
      case 'en-GB':
        return ODS_LOCALE.EN;
      case 'fr':
      case 'fr-CA':
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
  }, [dateFnsLocale]);
};

export default useLocaleForDatePicker;
