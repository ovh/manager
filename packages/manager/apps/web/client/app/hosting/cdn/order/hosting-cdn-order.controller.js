export default class HostingCdnOrderCtrl {
  $onInit() {
    this.workflowOptions.getPlanCode = () => this.getPlanCode();

    // Preselect CDN Advanced
    this.cdnPlanCode = this.planToPreselect;
  }

  getPlanCode() {
    return this.cdnPlanCode;
  }

  getOrderState({ isLoading }) {
    this.isStepperLoading = isLoading;
  }
}
