import pick from 'lodash/pick';

export default class TelecomTelephonyAbbreviatedNumbersCtrl {
  /* @ngInject  */
  constructor(
    $q,
    $stateParams,
    $translate,
    OvhApiTelephony,
    TucToast,
    PAGINATION_PER_PAGE,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.PAGINATION_PER_PAGE = PAGINATION_PER_PAGE;
  }

  remove({ abbreviatedNumber }) {
    return this.OvhApiTelephony.AbbreviatedNumber()
      .v6()
      .remove({
        billingAccount: this.$stateParams.billingAccount,
        abbreviatedNumber,
      }).$promise;
  }

  insert(abbreviatedNumber) {
    return this.OvhApiTelephony.AbbreviatedNumber()
      .v6()
      .insert(
        {
          billingAccount: this.$stateParams.billingAccount,
          serviceName: this.$stateParams.serviceName,
        },
        abbreviatedNumber,
      ).$promise;
  }

  update(abbreviatedNumber) {
    return this.OvhApiTelephony.AbbreviatedNumber()
      .v6()
      .update(
        {
          billingAccount: this.$stateParams.billingAccount,
          serviceName: this.$stateParams.serviceName,
          abbreviatedNumber: abbreviatedNumber.abbreviatedNumber,
        },
        pick(abbreviatedNumber, ['destinationNumber', 'name', 'surname']),
      ).$promise;
  }

  load() {
    this.loading = true;
    this.abbreviatedNumbers = [];
    return this.OvhApiTelephony.AbbreviatedNumber()
      .Aapi()
      .query({
        billingAccount: this.$stateParams.billingAccount,
      })
      .$promise.then(
        (abbreviatedNumbers) => {
          this.abbreviatedNumbers = abbreviatedNumbers;
        },
        () => {
          this.TucToast.error(
            this.$translate.instant('telephony_abbreviated_numbers_read_error'),
          );
        },
      )
      .finally(() => {
        this.loading = false;
      });
  }

  $onInit() {
    this.pattern = {
      regexp: /^7\d{2,3}$/,
      startDigit: 7,
      errorMessage: this.$translate.instant(
        'telephony_abbreviated_numbers_pattern_error',
      ),
    };
    this.filter = {
      perPage: this.PAGINATION_PER_PAGE,
    };

    return this.$q.all([
      this.OvhApiTelephony.v6()
        .get({ billingAccount: this.$stateParams.billingAccount })
        .$promise.then(
          (detail) => {
            this.exportFilename = `ab_num_${detail.description ||
              this.$stateParams.billingAccount}.csv`;
          },
          () => {
            this.exportFilename = `ab_num_${this.$stateParams.billingAccount}.csv`;
          },
        ),
      this.load(),
    ]);
  }
}
