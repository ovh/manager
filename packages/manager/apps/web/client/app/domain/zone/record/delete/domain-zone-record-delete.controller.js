import isArray from 'lodash/isArray';

angular.module('App').controller(
  'DomainZoneRecordDeleteCtrl',
  class DomainZoneRecordDeleteCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.entryToDelete = this.$scope.currentActionData;
      this.massDelete = isArray(this.entryToDelete);
      this.loading = false;

      if (!this.massDelete) {
        this.entryToDelete.fieldTypeFormatted = this.entryToDelete.fieldType;
      }

      this.$scope.deleteDnsEntry = () => this.deleteDnsEntry();
    }

    deleteDnsEntry() {
      this.loading = true;
      if (this.massDelete) {
        return this.Domain.deleteDnsEntry(
          this.$stateParams.productId,
          this.entryToDelete,
        )
          .then(() =>
            this.Alerter.success(
              this.$translate.instant(
                'domain_configuration_dns_entry_delete_mass_success',
              ),
              this.$scope.alerts.main,
            ),
          )
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'domain_configuration_dns_entry_delete_mass_fail',
              ),
              err,
              this.$scope.alerts.main,
            ),
          )
          .finally(() => this.$scope.resetAction());
      }
      return this.Domain.deleteDnsEntry(
        this.$stateParams.productId,
        this.entryToDelete.id,
      )
        .then(() =>
          this.Alerter.success(
            this.$translate.instant(
              'domain_configuration_dns_entry_delete_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'domain_configuration_dns_entry_delete_fail',
              {
                t0: `${this.entryToDelete.subDomain}.${this.entryToDelete.zone}`,
              },
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => this.$scope.resetAction());
    }
  },
);
