import {
  buildEnumList,
  searchEnumItem,
  getEnumItemValue,
} from '../../../../../sva-wallet.constants';

export default class BeneficiariesController {
  /* @ngInject */
  constructor($translate, countryEnum, $uibModalInstance, beneficiary, mode) {
    this.$translate = $translate;
    this.countryEnum = countryEnum;
    this.$uibModalInstance = $uibModalInstance;
    this.beneficiary = beneficiary || {};

    this.mode = mode || 'add';
  }

  $onInit() {
    this.countrySelects = [
      'countryOfBirth',
      'countryOfResidence',
      'nationality',
    ];

    this.model = {
      addressOfResidence: {},
    };

    this.countriesValues = buildEnumList(
      this.countryEnum.filter((countryCode) => countryCode !== 'UNKNOWN'),
      'telephony_billingAccount_svaWallet_kyc_country_',
      this.$translate,
    );

    // convert field values to selects items
    this.countrySelects.forEach((field) => {
      if (this.beneficiary[field]) {
        this.model[field] = searchEnumItem(
          this.countriesValues,
          this.beneficiary[field],
        );
      }
    });
  }

  confirm() {
    if (!this.form.$invalid) {
      this.$uibModalInstance.close({
        ...this.beneficiary,

        // convert selects items to values
        ...this.countrySelects.reduce(
          (values, field) => ({
            ...values,
            [field]: getEnumItemValue(this.model[field]),
          }),
          {},
        ),
      });
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
