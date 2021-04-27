export default class HostingCdnOrderCtrl {
  $onInit() {
    this.workflowOptions.getPlanCode = () => this.getPlanCode();
  }

  getPlanCode() {
    return this.cdnPlanCode;
  }

  getOrderState({ isLoading }) {
    this.isStepperLoading = isLoading;
  }
}
