/* eslint-disable max-classes-per-file */

import {
  PERSONAL_DATA_PROTECTION_BY_OVH_LINK,
  PERSONAL_DATA_PROTECTION_BY_YOUSIGN_LINK,
} from './constants';

class BankAccountModel {
  constructor(country) {
    this.country = country;

    this.ownerName = null;
    this.addressNumber = null;
    this.addressStreet = null;
    this.addressZip = null;
    this.addressCity = null;
    this.fullAddress = null;
  }

  get ownerAddress() {
    if (this.country !== 'FR') {
      return this.fullAddress;
    }

    return [
      this.addressNumber || '',
      this.addressStreet || '',
      this.addressZip || '',
      this.addressCity || '',
    ]
      .join(' ')
      .trim();
  }
}

export default class PaymentMethodAddLegacyBillingAddressCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.model.billingAddress = new BankAccountModel(
      this.currentUser.billingCountry,
    );
    this.setDataProtectionLinks();
  }

  setDataProtectionLinks() {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    this.dataProtectionOvhLink =
      PERSONAL_DATA_PROTECTION_BY_OVH_LINK[ovhSubsidiary] ||
      PERSONAL_DATA_PROTECTION_BY_OVH_LINK.DEFAULT;
    this.dataProtectionYouSignLink =
      PERSONAL_DATA_PROTECTION_BY_YOUSIGN_LINK[ovhSubsidiary] ||
      PERSONAL_DATA_PROTECTION_BY_YOUSIGN_LINK.DEFAULT;
  }
}
/* eslint-enable max-classes-per-file */
