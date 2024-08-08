angular.module('controllers').controller(
  'DomainZoneDefaultTTLCtrl',
  class DomainZoneDefaultTTLCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.domain = this.$scope.currentActionData;
      this.autorizedValues = {
        min: 60,
        max: 2147483647,
      };
      this.loading = true;
      this.zoneSOA = { ttl: '' };

      this.Domain.getZoneSOA(this.domain.name)
        .then((data) => {
          this.zoneSOA = data;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_ZONE_default_ttl_error'),
            err,
            this.$scope.alerts.main,
          );
          this.$scope.resetAction();
        })
        .finally(() => {
          this.loading = false;
        });
    }

    updateDefaultTTL() {
      this.loading = true;
      return this.Domain.putZoneSOA(this.domain.name, this.zoneSOA)
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('domain_tab_ZONE_default_ttl_success'),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_ZONE_default_ttl_error'),
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
