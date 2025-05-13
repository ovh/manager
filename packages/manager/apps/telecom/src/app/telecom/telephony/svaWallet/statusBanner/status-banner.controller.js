import {
  isKYCUnderReview,
  isKYCWaitingDocument,
} from '../sva-wallet.constants';

export default class StatusBannerController {
  $onInit() {
    this.isUnderReview = isKYCUnderReview(this.svaWallet);
    this.needCustomerAction = isKYCWaitingDocument(this.svaWallet);
  }
}
