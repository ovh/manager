export default class TelephonyLineOrderRmaCtrl {
  /* @ngInject */
  constructor(TELEPHONY_RMA) {
    this.TELEPHONY_RMA = TELEPHONY_RMA;
  }

  $onInit() {
    this.pdfBaseUrl = this.TELEPHONY_RMA.pdfBaseUrl;
  }
}
