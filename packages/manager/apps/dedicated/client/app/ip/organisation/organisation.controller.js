export default class {
  /* @ngInject */
  constructor($scope, $translate, Ip, IpOrganisation) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
    this.IpOrganisation = IpOrganisation;
  }

  $onInit() {
    this.$scope.loadingOrganisation = false;
    this.$scope.organisations = null;

    return this.loadOrganisations();
  }

  loadOrganisations() {
    this.$scope.organisations = null;
    this.$scope.loadingOrganisation = true;

    return this.IpOrganisation.getIpOrganisation()
      .then((organisations) => {
        this.$scope.organisations = organisations;
      })
      .catch((data) =>
        this.goToOrganisation({
          message: {
            text: this.$translate.instant('ip_organisation_load_error'),
            data: {
              ...data,
              type: 'ERROR',
            },
          },
        }),
      )
      .finally(() => {
        this.$scope.loadingOrganisation = false;
      });
  }
}
