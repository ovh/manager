import {
  INVOICE_DELAY_BANNER_CLOSING_DAY,
  INVOICE_DELAY_BANNER_OPENING_DAY,
} from '@/pages/dashboard/dashboard.constants';

// The window straddles the month boundary: it opens on the 28th and closes at
// the end of the 7th of the next month, so a date falls inside it whenever it
// sits at either end of a month. Kept in sync with the invoices page of the
// billing application (modules/billing/src/main/history), which draws the same
// banner over the same window.
export const isWithinInvoiceDelayPeriod = (date: Date = new Date()): boolean => {
  const dayOfMonth = date.getDate();

  return (
    dayOfMonth >= INVOICE_DELAY_BANNER_OPENING_DAY || dayOfMonth <= INVOICE_DELAY_BANNER_CLOSING_DAY
  );
};
