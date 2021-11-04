import { buildEnumList } from '../../sva-wallet.constants';

export default class ReadonlyIdentityController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.countriesValues = buildEnumList(
      this.countryEnum.filter((countryCode) => countryCode !== 'UNKNOWN'),
      'telephony_billingAccount_svaWallet_kyc_country_',
      this.$translate,
    );
  }
}
