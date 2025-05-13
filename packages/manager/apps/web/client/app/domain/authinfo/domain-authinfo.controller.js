angular.module('App').controller(
  'DomainAuthInfoCtrl',
  class DomainAuthInfoCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.domain = angular.copy(this.$scope.currentActionData);
      this.loading = true;

      this.Domain.getAuthInfo(this.domain.name)
        .then((authinfo) => {
          this.domain.authinfo = authinfo;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_dashboard_show_authinfo_error'),
            err,
            this.$scope.alerts.main,
          );
          this.$scope.resetAction();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
);
