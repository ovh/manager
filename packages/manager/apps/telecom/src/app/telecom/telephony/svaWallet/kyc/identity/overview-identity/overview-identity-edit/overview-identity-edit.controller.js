import {
  DISALLOW_BENEFICIARIES_KINDS,
  FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS,
} from '../../identity.constants';
import { DIRECTORY_WAY_NUMBER_EXTRA_ENUM } from '../../../../../service/contact/contact.constants';

import { REGEX_VALIDATORS } from './overview-identity-edit.constants';
import {
  buildEnumList,
  getEnumItemValue,
} from '../../../../sva-wallet.constants';

import lemonWayLogo from '../../../../lemonway_logo.png';

export default class KycIdentityOverviewEditController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.isOpenModal = false;

    this.confirmationCode = this.$translate.instant(
      'telephony_billingAccount_svaWallet_kyc_identity_confirm_code',
    );
    this.confirmationPattern = new RegExp(`^${this.confirmationCode}$`);

    this.lemonWayLogo = lemonWayLogo;

    this.companyModel = {
      kind: {
        name: this.$translate.instant(
          `telephony_billingAccount_svaWallet_kyc_company_kind_${this.svaWallet.company.kind}`,
        ),
        value: this.svaWallet.company.kind,
      },
    };

    this.representativeModel = {
      nationality: this.svaWallet.representative.nationality.map((elm) => {
        return {
          name: this.$translate.instant(
            `telephony_billingAccount_svaWallet_kyc_country_${elm}`,
          ),
          value: elm,
        };
      }),
      streetNumberExtra: this.svaWallet.representative.streetNumberExtra?.toUpperCase(),
      countryOfBirth: {
        name: this.$translate.instant(
          `telephony_billingAccount_svaWallet_kyc_country_${this.svaWallet.representative.countryOfBirth}`,
        ),
        value: this.svaWallet.representative.countryOfBirth,
      },
      countryOfResidence: {
        name: this.$translate.instant(
          `telephony_billingAccount_svaWallet_kyc_country_${this.svaWallet.representative.countryOfResidence}`,
        ),
        value: this.svaWallet.representative.countryOfResidence,
      },
    };

    this.representativeCountrySelects = [
      'countryOfBirth',
      'countryOfResidence',
      'nationality',
    ];

    this.streetNumberExtraEnum = [
      '',
      ...DIRECTORY_WAY_NUMBER_EXTRA_ENUM.map((val) => val.toUpperCase()),
    ];

    this.REGEX_VALIDATORS = REGEX_VALIDATORS;
    this.requirements = false;

    this.wallet = {
      company: this.svaWallet.company,
      representative: { ...this.svaWallet.representative, isBeneficiary: true },
    };

    this.loading = {
      submit: false,
    };

    this.companyKindsValues = buildEnumList(
      this.companyKinds,
      'telephony_billingAccount_svaWallet_kyc_company_kind_',
      this.$translate,
    );

    this.countriesValues = buildEnumList(
      this.countryEnum.filter((countryCode) => countryCode !== 'UNKNOWN'),
      'telephony_billingAccount_svaWallet_kyc_country_',
      this.$translate,
    );

    this.onCompanyKindChange({ value: this.svaWallet.company.kind });
  }

  onCompanyKindChange({ value }) {
    this.displayBeneficiaries = !DISALLOW_BENEFICIARIES_KINDS.includes(value);
    this.forceRepresentativeIsBeneficiary = FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS.includes(
      value,
    );
    if (this.forceRepresentativeIsBeneficiary) {
      this.wallet.representative.isBeneficiary = true;
    }
  }

  formatWallet() {
    delete this.wallet.representative.id;
    const companyKind = getEnumItemValue(this.companyModel.kind);
    const allowBeneficiaries = !DISALLOW_BENEFICIARIES_KINDS.includes(
      companyKind,
    );

    const company = {
      ...this.wallet.company,
      kind: companyKind,
      beneficiaries: allowBeneficiaries
        ? this.wallet.company.beneficiaries
        : [],
    };

    const representative = {
      ...this.wallet.representative,
      // convert selects items to values
      ...this.representativeCountrySelects.reduce(
        (values, field) => ({
          ...values,
          [field]: getEnumItemValue(this.representativeModel[field]),
        }),
        {},
      ),
      addressOfResidence: {
        ...this.wallet.representative.addressOfResidence,
        streetNumberExtra: this.representativeModel.streetNumberExtra?.toLowerCase(),
      },
    };

    return {
      ...this.wallet,
      company,
      representative,
    };
  }

  openModal() {
    this.isOpenModal = true;
  }

  dismissModal() {
    this.isOpenModal = false;
  }

  submit() {
    this.isOpenModal = false;

    this.errorMessage = undefined;

    const wallet = this.formatWallet();

    this.loading.submit = true;
    return this.putWallet(wallet)
      .then(() => {
        this.editMode = false;
      })
      .catch((error) => {
        this.errorMessage = error.data.message;
      })
      .finally(() => {
        this.loading.submit = false;
      });
  }

  onCancelEdit() {
    this.editMode = false;
  }
}
