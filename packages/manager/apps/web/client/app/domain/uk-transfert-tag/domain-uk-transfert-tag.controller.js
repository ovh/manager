angular.module('App').controller(
  'DomainUkTransfertTagCtrl',
  class DomainUkTransfertTagCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.domain = angular.copy(this.$scope.currentActionData);
      this.loading = false;
      this.ukTag = '';

      this.$scope.addTagUkTransfer = () => this.addTagUkTransfer();
    }

    addTagUkTransfer() {
      this.loading = true;
      return this.Domain.postTagsUk(this.$stateParams.productId, {
        tag: this.ukTag,
      })
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('domain_dashboard_add_uk_tags_success'),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_dashboard_add_uk_tags_error'),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
