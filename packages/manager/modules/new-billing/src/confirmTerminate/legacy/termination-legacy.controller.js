import get from 'lodash/get';

import { SUB_TYPE_PROPERTIES } from './termination-legacy.constants';

export default class TerminateServiceCtrl {
  /* @ngInject */
  constructor($q, $stateParams, coreConfig, BillingTerminateLegacy) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.coreConfig = coreConfig;
    this.BillingTerminate = BillingTerminateLegacy;
  }

  $onInit() {
    this.reasons = [
      'LACK_OF_PERFORMANCES',
      'TOO_EXPENSIVE',
      'TOO_HARD_TO_USE',
      'NOT_RELIABLE',
      'NOT_NEEDED_ANYMORE',
      'MIGRATED_TO_COMPETITOR',
      'MIGRATED_TO_ANOTHER_OVH_PRODUCT',
      'FEATURES_DONT_SUIT_ME',
      'UNSATIFIED_BY_CUSTOMER_SUPPORT',
      'NO_ANSWER',
      'OTHER',
    ];
    this.futureUses = [
      'SUBSCRIBE_AN_OTHER_SERVICE',
      'SUBSCRIBE_SIMILAR_SERVICE_WITH_COMPETITOR',
      'SUBSCRIBE_OTHER_KIND_OF_SERVICE_WITH_COMPETITOR',
      'NOT_REPLACING_SERVICE',
      'NO_ANSWER',
      'OTHER',
    ];

    this.serviceId = this.$stateParams.id;
    this.serviceState = null;
    this.token = this.$stateParams.token;
    this.loading = true;
    this.terminating = false;
    this.error = false;
    this.globalError = null;

    if (!this.token || !this.serviceId) {
      this.globalError = true;
      return;
    }

    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.USVersion = ovhSubsidiary === 'US';

    this.loadService().catch(() => {
      this.globalError = true;
    });
  }

  loadService() {
    return this.BillingTerminate.getServiceInfo(this.serviceId)
      .then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
        return this.BillingTerminate.getServiceApi(serviceInfos.serviceId).then(
          (service) => {
            this.serviceState = get(service, 'resource.state');
          },
        );
      })
      .then(() => {
        const subTypeProperty = get(
          SUB_TYPE_PROPERTIES,
          this.serviceInfos.serviceType,
        );
        this.serviceType = this.serviceInfos.serviceType;
        if (subTypeProperty) {
          return this.BillingTerminate.getServiceDetails(
            this.serviceInfos.serviceId,
          ).then((serviceDetails) => {
            this.serviceType = get(
              serviceDetails,
              subTypeProperty,
              this.serviceInfos.serviceType,
            );
          });
        }
        return this.$q.when();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  confirmTermination() {
    this.terminating = true;
    this.BillingTerminate.confirmTermination(
      this.serviceId,
      this.serviceInfos.domain,
      this.futureUse,
      this.reason,
      this.commentary,
      this.token,
    )
      .then(() => {
        this.error = false;
        this.serviceState = 'suspending';
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.terminating = false;
      });
  }
}
