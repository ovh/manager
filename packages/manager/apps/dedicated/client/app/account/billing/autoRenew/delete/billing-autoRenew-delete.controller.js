import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';

angular
  .module('Billing.controllers')
  .controller('billingAutoRenewDeleteCtrl', class BillingAutoRenewDeleteCtrl {
    constructor($filter, $q, $rootScope, $scope, $translate, Alerter, BillingAutoRenew,
      AUTORENEW_EVENT, Server) {
      this.$filter = $filter;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$translate = $translate;
      this.Server = Server;
      this.Alerter = Alerter;
      this.BillingAutoRenew = BillingAutoRenew;
      this.loaders = {
        init: false,
      };
      this.AUTORENEW_EVENT = AUTORENEW_EVENT;
    }

    $onInit() {
      this.loaders.init = true;
      this.selectedServices = this.$scope.currentActionData;
      this.serviceToDisplay = head(this.selectedServices);
      this.serviceToDisplay.expirationText = this.$filter('date')(this.serviceToDisplay.expiration, 'mediumDate');

      if (this.serviceToDisplay.serviceType === 'DEDICATED_SERVER') {
        this.Server.getSelected(this.serviceToDisplay.serviceId)
          .then((server) => {
            this.serviceToDisplay.engagement = server.engagement;
          })
          .finally(() => { this.loaders.init = false; });
      } else {
        this.loaders.init = false;
      }
    }

    switchRenewalModeToManual() {
      const formattedServices = map(this.selectedServices, (originalService) => {
        const service = cloneDeep(originalService);
        service.renew.automatic = false;

        return pick(service, ['serviceId', 'serviceType', 'renew']);
      });

      return this.BillingAutoRenew.updateServices(formattedServices);
    }

    switchRenewalModeToDeleteAtExpiration() {
      const formattedServices = map(this.selectedServices, (originalService) => {
        const service = cloneDeep(originalService);
        service.renew.deleteAtExpiration = true;

        return pick(service, ['serviceId', 'serviceType', 'renew']);
      });

      return this.BillingAutoRenew
        .updateServices(formattedServices)
        .then(() => {
          this.$scope.$emit(this.AUTORENEW_EVENT.TERMINATE_AT_EXPIRATION, formattedServices);
        });
    }

    switchRenewalModeToManualIfNeeded() {
      const AUTO_RENEW_TYPES = ['automaticV2014', 'automaticV2016', 'automaticForcedProduct'];
      const renewType = get(this.serviceToDisplay, 'service.renewalType', this.serviceToDisplay.renewalType);
      const serviceIsAutomaticallyRenewed = AUTO_RENEW_TYPES.includes(renewType);

      return this.serviceToDisplay.renew.automatic && !serviceIsAutomaticallyRenewed
        ? this.switchRenewalModeToManual()
        : this.$q.when();
    }

    deleteRenew() {
      if (this.serviceToDisplay.engagement) {
        return this.$scope.resetAction();
      }

      return this.switchRenewalModeToManualIfNeeded()
        .then(() => this.switchRenewalModeToDeleteAtExpiration())
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('autorenew_service_update_step2_error'), err);
        })
        .finally(() => {
          this.$rootScope.$broadcast(this.BillingAutoRenew.events.AUTORENEW_CHANGED);
          this.$scope.resetAction();
        });
    }
  });
