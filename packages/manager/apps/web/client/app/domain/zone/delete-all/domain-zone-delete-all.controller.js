angular.module('App').controller(
  'DomainZoneDeleteAllCtrl',
  class DomainZoneDeleteAllCtrl {
    constructor($scope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.domainService = Domain;
    }

    $onInit() {
      this.domain = this.$scope.currentActionData;
      this.loading = false;
      this.$scope.deleteAllZone = () => this.deleteAllZone();
    }

    /**
     * Initiates the process to delete all DNS zones associated with a domain and handles the response.
     *
     * This function triggers a request to delete all DNS zones for the specified domain.
     * Upon successful deletion, it performs several actions:
     *   1. Stores the current time in localStorage with a key specific to the domain. This
     *      is used to track when the deletion occurred.
     *   2. Displays a success message to the user.
     * In case of an error during the deletion process, an error alert is shown.
     * Finally, regardless of the outcome, it executes a cleanup/reset action.
     */
    deleteAllZone() {
      // Indicate loading process
      this.loading = true;

      // Call the service to delete all zones for the domain
      return this.domainService
        .deleteAllZone(this.domain.name)
        .then(() => {
          // Define necessary variables
          const keyDeleteDomain = `dns-delete-${this.domain.name}`;
          const validityDate = new Date();

          // Store the current date in localStorage for future reference
          window.localStorage.setItem(keyDeleteDomain, validityDate);

          // Display a success message
          this.alerter.success(
            this.$translate.instant(
              'domain_configuration_zonedns_delete_all_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          // In case of an error, display an alert message
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'domain_configuration_zonedns_delete_all_error',
            ),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          // Reset the action in the scope, completing the process
          this.$scope.resetAction();
        });
    }
  },
);
