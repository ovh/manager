export default class CdnManageCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    $filter,
    $translate,
    Cdn,
    currentActiveLink,
    domainsLink,
  ) {
    // injections
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.$translate = $translate;
    this.Cdn = Cdn;
    this.currentActiveLink = currentActiveLink;
    this.domainsLink = domainsLink;

    // attributes used in view
    this.cdn = null;
    this.loading = false;
  }

  $onInit() {
    this.loading = true;

    return this.$q
      .allSettled([
        this.Cdn.getSelected(this.$stateParams.productId, true),
        this.Cdn.getServiceInfos(this.$stateParams.productId),
      ])
      .then(([selected, serviceInfos]) => {
        this.cdn = selected;
        this.serviceInfos = serviceInfos;

        const date = new Date();
        const { endingDay } = this.cdn;

        if (!endingDay) {
          this.cdn.endingEstimationDate = '-';
        } else if (endingDay > 90) {
          this.cdn.endingEstimationDate = this.$translate.instant(
            'cdn_configuration_more_than_three_month',
          );
        } else {
          date.setDate(date.getDate() + endingDay);
          this.cdn.endingEstimationDate = this.$filter('date')(
            date,
            'mediumDate',
          );
        }
      })
      .catch(([errCdn, errServiceInfos]) => {
        const errs = [];

        if (errCdn.data && errCdn.data.type === 'ERROR') {
          errs.push(errCdn);
        } else {
          this.cdn = errCdn;
        }

        if (errServiceInfos.data && errServiceInfos.data.type === 'ERROR') {
          errs.push(errServiceInfos);
        } else {
          this.serviceInfos = errServiceInfos.data;
        }

        this.$scope.setMessage(
          this.$translate.instant('cdn_dashboard_loading_error'),
          {
            message: errs.map((data) => data.data.message).join(', '),
            type: 'ERROR',
          },
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
