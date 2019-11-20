export default class TelecomBillingAccountService {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  getServiceLink(billingAccount, { featureType, serviceName, serviceType }) {
    const statePrefix = 'telecom.telephony.billingAccount.';

    if (['alias'].includes(serviceType)) {
      return this.$state.href(`${statePrefix}alias`, { billingAccount, serviceName });
    }

    if (['fax', 'voicefax'].includes(featureType)) {
      return this.$state.href(`${statePrefix}fax`, { billingAccount, serviceName });
    }

    if (['carrierSip'].includes(featureType)) {
      return this.$state.href(`${statePrefix}carrierSip`, { billingAccount, serviceName });
    }

    return this.$state.href(`${statePrefix}line`, { billingAccount, serviceName });
  }
}
