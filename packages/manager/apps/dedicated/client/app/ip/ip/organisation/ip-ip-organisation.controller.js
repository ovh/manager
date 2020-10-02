angular.module('Module.ip.controllers').controller(
  'IpOrganisationCtrl',
  class IpOrganisationController {
    /* @ngInject */
    constructor(
      $scope,
      $translate,
      goToDashboard,
      Ip,
      IpOrganisation,
      Alerter,
    ) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.goToDashboard = goToDashboard;
      this.Ip = Ip;
      this.IpOrganisation = IpOrganisation;
      this.Alerter = Alerter;
    }

    $onInit() {
      this.$scope.alert = 'ip_organisation_alerter';
      this.$scope.loadingOrganisation = false;
      this.$scope.organisations = null;

      this.$scope.$on('ips.organisation.display', () => {
        this.$scope.organisations = null;
        this.loadOrganisations();
      });
    }

    loadOrganisations() {
      this.$scope.organisations = null;
      this.$scope.loadingOrganisation = true;
      return this.IpOrganisation.getIpOrganisation()
        .then((organisations) => {
          this.$scope.organisations = organisations;
        })
        .catch((data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_organisation_load_error'),
            data.data,
            this.$scope.alert,
          );
        })
        .finally(() => {
          this.$scope.loadingOrganisation = false;
        });
    }
  },
);
