export default class {
  /* @ngInject */
  constructor($scope, ipFeatureAvailability) {
    this.$scope = $scope;
    this.ipFeatureAvailability = ipFeatureAvailability;
  }

  $onInit() {
    this.$scope.newOrganisation = this.scope.newOrganisation;
    this.$scope.formOrganisation = this.scope.formOrganisation;
    this.$scope.list = this.scope.list;

    this.$scope.organisationForm = null;

    this.$scope.$watch('organisationForm.$valid', () => {
      this.$scope.formOrganisation.formValid = this.$scope.organisationForm.$valid;
    });

    this.$scope.showState = () => {
      return this.ipFeatureAvailability.showState();
    };

    this.$scope.getClassLabel = (label, noDirty) => {
      if (label && (noDirty || label.$dirty)) {
        return (label.$invalid && 'error') || 'success';
      }
      return '';
    };

    this.$scope.hasError = (label) => {
      return label.$invalid && label.$dirty;
    };
  }
}
