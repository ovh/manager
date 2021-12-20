import { buildEnumList } from '../../sva-wallet.constants';

export default class ReadonlyIdentityController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.companyKind = '';
  }

  async $onInit() {
    this.countriesValues = buildEnumList(
      this.countryEnum.filter((countryCode) => countryCode !== 'UNKNOWN'),
      'telephony_billingAccount_svaWallet_kyc_country_',
      this.$translate,
    );

    this.companyKinds = await this.$http
      .get('/me.json')
      .then(
        ({ data: schema }) =>
          schema.models['me.sva.wallet.CompanyKindEnum'].enum,
      );

    this.companyKindsValues = buildEnumList(
      this.companyKinds,
      'telephony_billingAccount_svaWallet_kyc_company_kind_',
      this.$translate,
    );

    this.companyKind = this.companyKindsValues.find(
      (kind) => kind.value === this.ngModel.legalform,
    )?.name;
  }

  onCompanyKindChange({ value }) {
    if (this.ngModel.legalform === value) return;

    this.ngModel.legalform = value;
  }
}
