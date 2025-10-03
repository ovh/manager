import {
  DISALLOW_BENEFICIARIES_KINDS,
  FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS,
  REGEX_VALIDATORS,
  WEBSITE_URL_DEFAULT,
  DIRECTORY_WAY_NUMBER_EXTRA_ENUM,
} from '../identity.constants';

import { buildEnumList, getEnumItemValue } from '../../../sva-wallet.constants';

import lemonWayLogo from '../../../lemonway_logo.png';

export default class KycIdentityFormController {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $window,
    coreURLBuilder,
    ovhPaymentMethodHelper,
  ) {
    this.billingAccount = $stateParams.billingAccount;
    this.$translate = $translate;
    this.$window = $window;
    this.coreURLBuilder = coreURLBuilder;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
  }

  $onInit() {
    this.isOpenModal = false;

    this.confirmationCode = this.$translate.instant(
      'telephony_billingAccount_svaWallet_kyc_identity_confirm_code',
    );
    this.confirmationPattern = new RegExp(`^${this.confirmationCode}$`);

    this.urlSiteWebPattern = REGEX_VALIDATORS.URLWEBSITE;

    this.lemonWayLogo = lemonWayLogo;

    this.companyModel = this.svaWallet
      ? {
          kind: {
            name: this.$translate.instant(
              `telephony_billingAccount_svaWallet_kyc_company_kind_${this.svaWallet.company.kind}`,
            ),
            value: this.svaWallet.company.kind,
          },
        }
      : {};

    this.representativeModel = this.svaWallet
      ? {
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
        }
      : {};

    this.representativeCountrySelects = [
      'countryOfBirth',
      'countryOfResidence',
      'nationality',
    ];

    this.forceRepresentativeIsBeneficiary = false;

    this.streetNumberExtraEnum = [
      '',
      ...DIRECTORY_WAY_NUMBER_EXTRA_ENUM.map((val) => val.toUpperCase()),
    ];

    this.REGEX_VALIDATORS = REGEX_VALIDATORS;
    this.WEBSITE_URL_DEFAULT = WEBSITE_URL_DEFAULT;
    this.requirements = false;

    this.wallet = {
      company: this.svaWallet
        ? this.svaWallet.company
        : {
            reseller: false,
            marketplace: false,
            crowdfundingPartner: false,
            beneficiaries: [],
          },
      representative: this.svaWallet
        ? { ...this.svaWallet.representative, isBeneficiary: true }
        : {
            isBeneficiary: false,
          },
    };

    if (this.wallet.company.websiteUrl === this.WEBSITE_URL_DEFAULT) {
      this.wallet.company.websiteUrl = '';
    }

    this.bankAccount = {
      holder: null,
      iban: '',
    };

    this.displayBeneficiaries = !!this.svaWallet;

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
    if (this.editMode) {
      delete this.wallet.representative.id;
    }

    const companyKind = getEnumItemValue(this.companyModel.kind);
    const allowBeneficiaries = !DISALLOW_BENEFICIARIES_KINDS.includes(
      companyKind,
    );

    if (this.wallet.company.marketplace && !this.wallet.company.websiteUrl) {
      this.wallet.company.websiteUrl = this.WEBSITE_URL_DEFAULT;
    }

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
    this.errorMessage = undefined;
    const wallet = this.formatWallet();

    this.loading.submit = true;
    if (this.editMode) {
      return this.putWallet(wallet)
        .then(() => {
          this.editMode = false;
        })
        .catch((error) => {
          this.errorMessage = error.data.message;
        })
        .finally(() => {
          this.loading.submit = false;
          this.isOpenModal = false;
        });
    }

    const redirectUrl = this.coreURLBuilder.buildURL(
      'telecom',
      `#/telephony/${this.billingAccount}`,
    );

    return this.saveWallet({ ...wallet, redirectUrl }, this.bankAccount)
      .then(({ url }) => {
        this.$window.top.location.href = url;
      })
      .catch((error) => {
        this.errorMessage = error.data.message;
      })
      .finally(() => {
        this.loading.submit = false;
        this.isOpenModal = false;
      });
  }

  onCancelEdit() {
    this.editMode = false;
  }
}
