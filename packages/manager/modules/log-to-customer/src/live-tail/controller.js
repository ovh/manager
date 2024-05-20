export default class LogToCustomerCtrl {
  $onInit() {
    this.kind = this.kindInitValue;
    this.logKeys = this.logKindsKeys[this.kind];
  }
}
