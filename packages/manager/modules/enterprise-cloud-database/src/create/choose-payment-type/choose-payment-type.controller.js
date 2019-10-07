export default class {
  $onInit() {
    this.selectedPaymentType = this.enterpriseDb.paymentType;
  }

  onPaymentTypeSelect(paymentType) {
    this.selectedPaymentType = paymentType;
    this.enterpriseDb.paymentType = paymentType;
  }
}
