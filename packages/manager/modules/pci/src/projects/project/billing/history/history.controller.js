import last from 'lodash/last';
import 'moment';

import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.billing.history';

export default class {
  /* @ngInject */
  constructor($q, atInternet, CucCloudMessage) {
    this.$q = $q;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;

    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGES_CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessage(),
      },
    );
  }

  $onInit() {
    this.minDate = moment(last(this.history)?.beginDate);
    this.maxDate = moment(this.history[0]?.beginDate).endOf('month');

    this.disablePrevious =
      this.minDate.month() + 1 === this.month &&
      this.minDate.year() === this.year;

    this.disableNext =
      moment(this.maxDate).month() + 1 === this.month &&
      moment(this.maxDate).year() === this.year;

    this.calendarOptions = {
      defaultDate: this.period,
      minDate: this.minDate
        .startOf('month')
        .subtract(1, 'seconds')
        .toISOString(),
      maxDate: this.maxDate.toISOString(),
      plugins: [
        // eslint-disable-next-line
        new monthSelectPlugin({
          shorthand: false,
          dateFormat: 'F Y',
          altFormat: 'F Y',
        }),
      ],
    };
    this.isExpanded = Object.keys(this.historyDetails).reduce(
      (acc, planFamily) => ({
        ...acc,
        [planFamily]: false,
      }),
      {},
    );
  }

  goToNextMonth() {
    if (this.month === 12) {
      return this.goToMonth(1, this.year + 1);
    }

    return this.goToMonth(this.month + 1, this.year);
  }

  goToPreviousMonth() {
    if (this.month === 1) {
      return this.goToMonth(12, this.year - 1);
    }

    return this.goToMonth(this.month - 1, this.year);
  }

  onDateChange(selectedDates) {
    const date = moment(selectedDates[0]);
    return this.goToMonth(date.month() + 1, date.year());
  }

  expandRow($row) {
    this.isExpanded[$row.planFamily] = !this.isExpanded[$row.planFamily];
  }

  exportConsumption() {
    this.isLoadingExport = true;
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::billing::extract_csv',
      type: 'action',
    });
    return this.exportToCSV(this.monthHistory.orderId)
      .then((fileURL) => {
        this.fileURL = fileURL;
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          `${this.translate.instant(
            'cpbc_billing_control_history_export_error',
          )} ${error.data?.message}`,
        ),
      );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
