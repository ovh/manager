import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';

export default class TelecomTelephonyAbbreviatedNumbersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    OvhApiTelephony,
    TucToast,
    PAGINATION_PER_PAGE,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.billingAccount = $stateParams.billingAccount;
    this.OvhApiTelephony = OvhApiTelephony;
    this.PAGINATION_PER_PAGE = PAGINATION_PER_PAGE;
    this.serviceName = $stateParams.serviceName;
    this.TucToast = TucToast;
  }

  remove({ abbreviatedNumber }) {
    return this.OvhApiTelephony.Line()
      .AbbreviatedNumber()
      .v6()
      .remove({
        billingAccount: this.billingAccount,
        serviceName: this.serviceName,
        abbreviatedNumber,
      }).$promise;
  }

  insert(abbreviatedNumber) {
    return this.OvhApiTelephony.Line()
      .AbbreviatedNumber()
      .v6()
      .insert(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        },
        abbreviatedNumber,
      ).$promise;
  }

  update(abbreviatedNumber) {
    return this.OvhApiTelephony.Line()
      .AbbreviatedNumber()
      .v6()
      .update(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
          abbreviatedNumber: abbreviatedNumber.abbreviatedNumber,
        },
        pick(abbreviatedNumber, ['destinationNumber', 'name', 'surname']),
      ).$promise;
  }

  load() {
    this.loading = true;
    this.abbreviatedNumbers = [];
    return this.OvhApiTelephony.Line()
      .AbbreviatedNumber()
      .Aapi()
      .query({
        billingAccount: this.billingAccount,
        serviceName: this.serviceName,
      })
      .$promise.then(
        (abbreviatedNumbers) => {
          this.abbreviatedNumbers = sortBy(
            abbreviatedNumbers,
            'abbreviatedNumber',
          );
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
      regexp: /^2\d{2,3}$/,
      startDigit: 2,
      errorMessage: this.$translate.instant(
        'telephony_line_actions_line_calls_abbreviated_numbers_pattern_error',
      ),
    };
    this.filter = {
      perPage: this.PAGINATION_PER_PAGE,
    };

    return this.$q
      .all([
        this.OvhApiTelephony.v6()
          .get({ billingAccount: this.billingAccount })
          .$promise.then(
            (detail) => detail.description || this.billingAccount,
            () => this.billingAccount,
          ),
        this.OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: this.billingAccount,
            serviceName: this.serviceName,
          })
          .$promise.then(
            (detail) => detail.description || this.serviceName,
            () => this.serviceName,
          ),
        this.load(),
      ])
      .then((details) => {
        this.exportFilename = `ab_num_${details[0]}_${details[1]}.csv`;
      });
  }
}
