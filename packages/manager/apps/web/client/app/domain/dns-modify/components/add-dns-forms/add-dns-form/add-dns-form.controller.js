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
    this.$scope.configurationType = this.configurationType;

    this.initModel();
    this.dnsEntry.nameServer = this.nameServer || '';
    this.dnsEntry.ip = this.ip || '';
    this.isHostnameValid = true;

    // Watch for changes in modifiedDnsList
    this.$scope.$watch(
      () => this.modifiedDnsList,
      (newValue) => {
        this.$scope.modifiedDnsList = newValue;
      },
      true, // Deep watch for array/object changes
    );

    // Watch for changes in shouldClearForm
    this.$scope.$watch(
      () => this.shouldClearForm,
      () => {
        if (this.shouldClearForm) {
          this.initModel();
          this.shouldClearForm = false;
        }
      },
    );

    // Watch for changes in dnsEntry.ip because it is not possible to use an IP without an hostname
    this.$scope.$watch(
      () => this.dnsEntry,
      () => {
        this.$scope.addDnsForm.nameServerField.$setValidity(
          'hostnameRequired',
          true,
        );
        if (this.dnsEntry.ip && !this.dnsEntry.nameServer) {
          this.$scope.addDnsForm.nameServerField.$setValidity(
            'hostnameRequired',
            false,
          );
        }
      },
      true,
    );
  };

  get isNameServerRequired() {
    return this.modifiedDnsList.length < this.minDnsSize;
  }

  onFormSubmit = () => {
    // This is where we perform mandatory validation of the hostname, because when we add a new form to the view,
    // mandatory validation is always triggered and displays an error message that we don't want to see in form initialization.
    this.$scope.addDnsForm.nameServerField.$setValidity(
      'hostnameRequired',
      true,
    );
    if (!this.dnsEntry.nameServer) {
      this.$scope.addDnsForm.nameServerField.$setValidity(
        'hostnameRequired',
        false,
      );
      return;
    }

    this.onSubmit({ dnsEntry: this.dnsEntry });
    this.initModel();
  };
}
