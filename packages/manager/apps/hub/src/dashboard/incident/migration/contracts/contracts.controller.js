export default class IncidentMigrationContractController {
  /* @ngInject */
  constructor(atInternet, $q, $translate, $window) {
    this.atInternet = atInternet;
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
  }

  $onInit() {
    this.totalContracts = this.contracts.length;
    this.contractIndex = 0;

    this.contractToValidate = this.getCurrentContract(this.contractIndex);
  }

  agreeContracts() {
    if (this.contractIndex < this.totalContracts - 1) {
      this.contractIndex += 1;
      this.contractToValidate = this.getCurrentContract(this.contractIndex);
      this.agree = false;
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::contract-validation::confirm`,
        type: 'action',
      });
      return this.$q.when();
    }
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::contract-validation::validate-replacement`,
      type: 'action',
    });
    this.isLoading = true;
    return this.migrateServices(false, this.servicesIds)
      .then(({ order }) => {
        this.$window.location = order.url;
        // return this.handleRedirect();
      })
      .catch((error) =>
        this.goToIncident(
          `${this.$translate.instant(
            'manager_hub_incident_migration_contract_error',
          )} ${error.data?.message}`,
        ),
      );
  }

  handleRedirect() {
    if (this.servicesIds.length === 1) {
      return this.redirectToServiceDashboard();
    }

    return this.isAllServicesToMigrate
      ? this.goBackToDashboard()
      : this.goToIncident(false, true);
  }

  getCurrentContract(contractIndex) {
    return [this.contracts[contractIndex]];
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::contract-validation::cancel`,
      type: 'action',
    });
    return this.goToIncident();
  }
}
