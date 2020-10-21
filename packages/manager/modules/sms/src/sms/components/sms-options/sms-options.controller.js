export default class SmsOptionsController {
  $onInit() {
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    this.minDate = minDate;
  }

  setCurrentTime() {
    this.model.delayedTime = new Date();
  }
}
