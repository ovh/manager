export default class DnsFormController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  initModel = () => {
    this.dnsEntry = {
      nameServer: '',
      ip: '',
    };
  };

  $onInit = () => {
    this.initModel();
    this.dnsEntry.nameServer = this.nameServer || '';
    this.dnsEntry.ip = this.ip || '';

    // Watch for changes in modifiedDnsList
    this.$scope.$watch(
      () => this.modifiedDnsList,
      (newValue) => {
        this.$scope.modifiedDnsList = newValue;
      },
      true, // Deep watch for array/object changes
    );

    // Watch for changes in modifiedDnsList
    this.$scope.$watch(
      () => this.configurationType,
      (newValue) => {
        this.$scope.configurationType = newValue;
      },
    );

    // Watch for changes in shouldClearForm
    this.$scope.$watch(
      () => this.shouldClearForm,
      (newValue) => {
        if (newValue) {
          this.initModel();
          this.shouldClearForm = false;
        }
      },
    );
  };

  onFormSubmit = () => {
    this.onSubmit({ dnsEntry: this.dnsEntry });
    this.initModel();
  };
}
