import { RMA } from './rma.constants';

export default class TelephonyLineOrderRmaCtrl {
  $onInit() {
    this.pdfBaseUrl = RMA.pdfBaseUrl;
  }
}
