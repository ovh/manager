import moment from 'moment';

export default class PciCalendarEditController {
  /* @ngInject */
  constructor($timeout) {
    this.$timeout = $timeout;
  }

  $onInit() {
    // Compute GMT
    const timezone = (new Date().getTimezoneOffset() / 60) * -1;
    this.gmt = 'GMT';
    if (timezone !== 0) {
      this.gmt += `${timezone > 0 ? ' +' : ' '}${timezone}`;
    }

    const [hoursModel, minutesModel] = this.model.split(':');
    this.readonlyTime = `${hoursModel} : ${minutesModel}`;
  }

  validate() {
    this.loading = true;
    return this.callback()
      .then(() => {
        this.callbackSuccess();
      })
      .catch(() => {
        this.cancel();
        this.callbackError();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.refreshCalendarValue = true;
    this.model = this.initValue;
    this.$timeout(() => {
      this.refreshCalendarValue = false;
    }, 100);
  }

  isEqualToInitialValue() {
    const [hoursModel, minutesModel] = this.model.split(':');
    const [hoursInitValue, minutesInitValue] = this.initValue.split(':');
    return hoursModel === hoursInitValue && minutesModel === minutesInitValue;
  }

  getLocalTime() {
    const date = moment.utc();
    const [hours, minutes] = this.model.split(':');
    date.set('hour', hours);
    date.set('minute', minutes);
    return moment(date)
      .local()
      .format();
  }
}
