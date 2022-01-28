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
    const currentLanguage = this.coreConfig.getUserLanguage();
    this.dataProtectionOvhLink =
      PERSONAL_DATA_PROTECTION_BY_OVH_LINK[currentLanguage] ||
      PERSONAL_DATA_PROTECTION_BY_OVH_LINK.en;
    this.dataProtectionYouSignLink =
      PERSONAL_DATA_PROTECTION_BY_YOUSIGN_LINK[currentLanguage] ||
      PERSONAL_DATA_PROTECTION_BY_YOUSIGN_LINK.en;
  }
}
/* eslint-enable max-classes-per-file */
