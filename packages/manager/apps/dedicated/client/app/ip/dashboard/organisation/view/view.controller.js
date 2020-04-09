export default class {
  /* @ngInject */
  constructor($scope, ipFeatureAvailability, IpOrganisation) {
    this.$scope = $scope;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.IpOrganisation = IpOrganisation;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loading = true;

    this.$scope.showState = () => {
      return this.ipFeatureAvailability.showState();
    };

    this.IpOrganisation.getIpOrganisationDetails(this.ipBlock.organizationId)
      .then((details) => {
        this.$scope.orga = details;
      })
      .finally(() => {
        this.$scope.loading = false;
      });
  }
}
