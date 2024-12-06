import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { addMonths, format, subMonths } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const useComputeDate = () => {
  const { i18n } = useTranslation('history');
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);

  const { year, month } = useParams();

  const billingYear = parseInt(year, 10);
  const billingMonth = parseInt(month, 10) - 1; // month is 0-based in Date
  const billingDate = new Date(billingYear, billingMonth, 1);

  const prevMonthDate = subMonths(billingDate, 1);
  const nextMonthDate = addMonths(billingDate, 1);

  const translationValues = {
    month: format(billingDate, 'MMMM', { locale: locales[userLocale] }),
    year: billingYear,
    lastMonth: format(prevMonthDate, 'MMMM', { locale: locales[userLocale] }),
    previousYear: prevMonthDate.getFullYear(),
  };

  return {
    billingDate,
    prevMonthDate,
    nextMonthDate,
    translationValues,
  };
};
