import { GUIDE_LINK } from './manualPayment.constants';

export default class {
  $onInit() {
    this.GuideLink = GUIDE_LINK;
    this.showAlertBanner = this.service.isHostingWeb;
  }
}
