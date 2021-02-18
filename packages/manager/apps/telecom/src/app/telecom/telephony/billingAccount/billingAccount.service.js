export default class TelecomBillingAccountService {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  static getServiceState(
    billingAccount,
    { featureType, serviceName, serviceType },
  ) {
    const statePrefix = 'telecom.telephony.billingAccount.';
    let state = `${statePrefix}line.dashboard`;

    if (['alias'].includes(serviceType)) {
      state = `${statePrefix}alias.details`;
    } else if (['fax', 'voicefax'].includes(featureType)) {
      state = `${statePrefix}fax.dashboard`;
    } else if (['carrierSip'].includes(featureType)) {
      state = `${statePrefix}carrierSip.dashboard`;
    }

    return {
      state,
      stateParams: {
        billingAccount,
        serviceName,
      },
    };
  }

  getServiceLink(billingAccount, { featureType, serviceName, serviceType }) {
    const { state, stateParams } = this.constructor.getServiceState(
      billingAccount,
      {
        featureType,
        serviceName,
        serviceType,
      },
    );
    return this.$state.href(state, stateParams);
  }
}
