export default class BillingPaymentsCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $state,
    $translate,
    atInternet,
    coreConfig,
    OvhApiMe,
    iceberg,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.OvhApiMe = OvhApiMe;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.payments = [];
    if (this.coreConfig.getRegion() === 'US') {
      return this.OvhApiMe.DepositRequest()
        .v6()
        .query()
        .$promise.then((depositRequests) => {
          this.paymentRequests = depositRequests;
          this.paymentRequestsHref = this.$state.href(
            'billing.main.payments.request',
          );
        });
    }
    return this.$q.when();
  }

  loadPayments($config) {
    let request = this.iceberg('/me/deposit')
      .query()
      .expand('CachedObjectList-Pages')
      .offset(Math.ceil($config.offset / ($config.pageSize || 1)))
      .limit($config.pageSize);

    if ($config.sort) {
      request = request.sort(
        $config.sort.property,
        $config.sort.dir > 0 ? 'ASC' : 'DESC',
      );
    }

    const filterCriteria = (propName) =>
      $config.criteria.filter(({ property }) => property === propName);

    filterCriteria('date').forEach((crit) => {
      switch (crit.operator) {
        case 'is':
          request = request.addFilter(
            'date',
            'gt',
            moment(crit.value)
              .subtract(1, 'd')
              .format('YYYY-MM-DD'),
          );
          request = request.addFilter(
            'date',
            'lt',
            moment(crit.value)
              .add(1, 'd')
              .format('YYYY-MM-DD'),
          );
          break;
        case 'isAfter':
          request = request.addFilter('date', 'gt', crit.value);
          break;
        case 'isBefore':
          request = request.addFilter('date', 'lt', crit.value);
          break;
        default:
          break;
      }
    });

    filterCriteria('amount.value').forEach((crit) => {
      request = request.addFilter(
        'amount.value',
        {
          is: 'eq',
          smaller: 'lt',
          bigger: 'gt',
        }[crit.operator],
        crit.value,
      );
    });

    filterCriteria('paymentInfo.paymentType').forEach((crit) => {
      request = request.addFilter(
        'paymentInfo.paymentType',
        {
          is: 'eq',
          isNot: 'ne',
        }[crit.operator],
        crit.value,
      );
    });

    return request.execute(null).$promise.then((result) => {
      this.payments = result.data;
      return {
        data: this.payments,
        meta: {
          totalCount:
            parseInt(result.headers['x-pagination-elements'], 10) || 0,
        },
      };
    });
  }

  getDatasToExport() {
    const header = [
      this.$translate.instant('payments_table_head_id'),
      this.$translate.instant('payments_table_head_date'),
      this.$translate.instant('payments_table_head_amount'),
      this.$translate.instant('payments_table_head_type'),
    ];
    const result = [header];
    return result.concat(
      this.payments.map((payment) => [
        payment.depositId,
        this.$filter('date')(payment.date, 'mediumDate'),
        payment.amount.text,
        this.getTranslatedPaiementType(payment),
      ]),
    );
  }

  getTranslatedPaiementType(payment) {
    return this.$translate.instant(
      payment.paymentInfo
        ? `common_payment_type_${payment.paymentInfo.paymentType}`
        : 'payments_table_type_not_available',
    );
  }

  shouldDisplayDepositsLinks() {
    return this.coreConfig.getRegion() !== 'US';
  }

  displayActionsCol() {
    return this.coreConfig.getRegion() !== 'US';
  }

  depositDetailsHref({ depositId }) {
    return this.$state.href('billing.main.payments.payment', {
      id: depositId,
    });
  }

  trackPaymentDetailOpening() {
    this.atInternet.trackClick({
      name: 'open_invoices',
      type: 'action',
      chapter1: 'billing',
      chapter2: 'monitored_payments',
    });
  }
}
