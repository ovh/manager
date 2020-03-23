export default class ManagerHubBillingSummaryCtrl {
  /* @ngInject */
  constructor(RedirectionService) {
    this.billingUrl = RedirectionService.getURL('billingEnterprise');
  }
}
