export default class CloudProjectBillingConsumptionCurrentCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    CucCloudMessage,
    CloudProjectBilling,
    OvhApiCloudProjectUsageCurrent,
    projectId,
  ) {
    this.$state = $state;
    this.projectId = projectId;
    this.data = {};

    this.loading = true;

    OvhApiCloudProjectUsageCurrent
      .v6()
      .get({ serviceName: projectId })
      .$promise
      .then(billingInfo => CloudProjectBilling.getConsumptionDetails(
        billingInfo,
        billingInfo,
      ))
      .then((data) => {
        this.data = data;
      })
      .catch((err) => {
        CucCloudMessage.error([$translate.instant('cpb_error_message'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
