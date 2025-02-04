import { ORDER_CDN_TRACKING } from './hosting-cdn-order.constant';

export default class HostingCdnOrderCtrl {
  $onInit() {
    this.workflowOptions.getPlanCode = () => this.getPlanCode();

    // Preselect CDN Advanced
    this.cdnPlanCode = this.planToPreselect;
    this.ORDER_CDN_TRACKING = ORDER_CDN_TRACKING;
  }

  getPlanCode() {
    return this.cdnPlanCode;
  }

  getOrderState({ isLoading }) {
    this.isStepperLoading = isLoading;
  }
}
