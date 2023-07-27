import { API_PATH } from './constants';

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
    return this.$http.get(`${API_PATH}/${taskID}`).then(({ data }) => data);
  }

  computeBilling() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // expected API date format -> ISO iso8601 (yyyy-MM-dd)
    const date = firstDayOfMonth.toISOString().substring(0, 10);
    return this.$http.post(API_PATH, { date }).then(({ data }) => data);
  }

  downloadBilling(url) {
    this.$window.location = url;
  }
}
