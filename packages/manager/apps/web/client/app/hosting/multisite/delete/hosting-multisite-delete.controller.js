import get from 'lodash/get';
import indexOf from 'lodash/indexOf';

angular.module('App').controller(
  'HostingRemoveDomainCtrl',
  class HostingRemoveDomainCtrl {
    constructor(
      $scope,
      $stateParams,
      $translate,
      atInternet,
      Alerter,
      HostingDomain,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.atInternet = atInternet;
      this.Alerter = Alerter;
      this.HostingDomain = HostingDomain;
    }

    $onInit() {
      this.atInternet.trackPage({
        name: 'web::hosting::multisites::detach-domain',
      });

      this.model = {
        domains: null,
      };
      this.selected = {
        autoconfigure: true,
        domain: this.$scope.currentActionData,
        wwwNeeded: false,
      };
      this.resultMessages = {
        OK: this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_remove_!success',
        ),
        PARTIAL: this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_remove_partial',
        ),
        ERROR: this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_remove_failure',
        ),
      };

      this.$scope.deleteMultiSite = () => this.deleteMultiSite();

      this.HostingDomain.getExistingDomains(this.$stateParams.productId, false)
        .then((data) => {
          this.model.domains = get(data, 'existingDomains');
        })
        .catch((err) => {
          this.$scope.resetAction();
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_DOMAINS_configuration_remove_step1_loading_error',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }

    domainsWwwExists() {
      return (
        this.model.domains &&
        indexOf(this.model.domains, `www.${this.selected.domain.name}`) !== -1
      );
    }

    deleteMultiSite() {
      this.atInternet.trackClick({
        name: 'web::hosting::multisites::detach-domain::confirm',
        type: 'action',
      });

      this.$scope.resetAction();
      return this.HostingDomain.removeDomain(
        this.$stateParams.productId,
        this.selected.domain.name,
        this.selected.wwwNeeded,
        this.selected.autoconfigure,
      )
        .then((data) => {
          this.Alerter.alertFromSWSBatchResult(
            this.resultMessages,
            data,
            this.$scope.alerts.main,
          );
          this.selected.domain.isUpdating = true;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_DOMAINS_configuration_remove_failure',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }
  },
);
