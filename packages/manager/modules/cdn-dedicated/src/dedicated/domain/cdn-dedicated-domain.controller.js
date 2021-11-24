export default class CdnDomainCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, CdnDomain) {
    // injections
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CdnDomain = CdnDomain;

    // attributes used in view
    this.domain = null;
    this.loading = false;
  }

  $onInit() {
    this.loading = true;

    return this.CdnDomain.getSelected(
      this.$stateParams.productId,
      this.$stateParams.domain,
      true,
    )
      .then((result) => {
        this.domain = result;
        this.$scope.domain = result;
      })
      .catch((error) => {
        this.$scope.setMessage(
          this.$translate.instant('cdn_domain_dashboard_loading_error'),
          error,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
