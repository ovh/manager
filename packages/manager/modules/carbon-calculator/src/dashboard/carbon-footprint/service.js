import { INVOICE_API_PATH, TASK_API_PATH } from './constants';

export default class CarbonFootprintService {
  /* @ngInject */
  constructor($http, $window, coreConfig) {
    this.$http = $http;
    this.$window = $window;
    this.coreConfig = coreConfig;
  }

  computePreviousMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    const dateTimeFormat = new Intl.DateTimeFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        month: 'long',
        year: 'numeric',
      },
    );
    return dateTimeFormat.format(date);
  }

  getTask(taskID) {
    return this.$http
      .get(`${TASK_API_PATH}/${taskID}`)
      .then(({ data }) => data);
  }

  computeBilling() {
    // expected API date -> Previous month date between 1st to 31st any one date
    const now = new Date();
    now.setUTCDate(0); // sets the date to the last date of the previous month
    const date = now.toISOString().substring(0, 10);
    return this.$http.post(TASK_API_PATH, { date }).then(({ data }) => data);
  }

  downloadBilling(url) {
    this.$window.location = url;
  }

  hasInvoice() {
    return this.$http
      .get(INVOICE_API_PATH)
      .then(({ data }) => data.hasInvoice)
      .catch(() => false);
  }
}
