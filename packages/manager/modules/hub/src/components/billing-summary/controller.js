import { get } from 'lodash-es';

export default class ManagerHubBillingSummaryCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, atInternet, coreURLBuilder) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.loading = true;
    this.billsError = false;
  }

  $onInit() {
    this.DEBT_PAY_URL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/history/debt/all/pay',
    );
    this.$translate.refresh().then(() => {
      this.periods = [1, 3, 6].map((months) => ({
        value: months,
        label: this.$translate.instant(`hub_billing_summary_period_${months}`),
      }));
      [this.billingPeriod] = this.periods;
    });
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.$q
      .all([this.loadBills(), this.loadDebt()])
      .catch(() => {
        this.billsError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadBills() {
    return this.fetchBills().then(({ data }) => {
      this.bills = data;
      this.formattedBillingPrice = this.getFormattedPrice(
        data.total,
        get(data, 'currency.code'),
      );
      this.buildPeriodFilter(data.period);
      return this.bills;
    });
  }

  loadDebt() {
    return this.fetchDebt().then(({ data }) => {
      this.debt = data;
      this.formattedDebtPrice = this.getFormattedPrice(
        get(data, 'dueAmount.value'),
        get(data, 'dueAmount.currencyCode'),
      );
      return this.debt;
    });
  }

  onPeriodChange() {
    this.bills = null;
    this.formattedBillingPrice = null;

    this.loading = true;
    return this.fetchBills(this.billingPeriod.value)
      .then(({ data }) => {
        if (data.status === 'ERROR') return;

        this.bills = data;
        this.formattedBillingPrice = this.getFormattedPrice(
          data.total,
          get(data, 'currency.code'),
        );
        this.buildPeriodFilter(data.period);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getFormattedPrice(price, currency) {
    return currency && price
      ? Intl.NumberFormat(this.$translate.use().replace('_', '-'), {
          style: 'currency',
          currency: currency || get(this.me, 'currency.code'),
          maximumSignificantdigits: 1,
        }).format(price)
      : '';
  }

  buildPeriodFilter({ from, to }) {
    this.periodFilter = [
      {
        field: 'date',
        comparator: 'isAfter',
        reference: [from],
      },
      {
        field: 'date',
        comparator: 'isBefore',
        reference: [to],
      },
    ];
  }

  getBillingURL() {
    return this.coreURLBuilder.buildURL('dedicated', '#/billing/history', {
      filter: JSON.stringify(this.periodFilter),
    });
  }

  fetchBills(monthlyPeriod = 1) {
    switch (monthlyPeriod) {
      case 1:
        this.atInternet.trackClick({
          name: `${this.trackingPrefix}::order::action::go-to-one-month`,
          type: 'action',
        });
        break;
      case 3:
        this.atInternet.trackClick({
          name: `${this.trackingPrefix}::order::action::go-to-three-month`,
          type: 'action',
        });
        break;
      case 6:
        this.atInternet.trackClick({
          name: `${this.trackingPrefix}::order::action::go-to-six-month`,
          type: 'action',
        });
        break;
      default:
        break;
    }
    return this.$http
      .get('/hub/bills', {
        serviceType: 'aapi',
        params: {
          billingPeriod: monthlyPeriod,
        },
      })
      .then(({ data }) => data)
      .then(({ data }) => data.bills);
  }

  fetchDebt() {
    return this.$http
      .get('/hub/debt', {
        serviceType: 'aapi',
      })
      .then(({ data }) => data)
      .then(({ data }) => data.debt);
  }

  refreshTile() {
    this.loading = true;
    this.billsError = false;
    return this.refresh()
      .then(({ bills }) => {
        this.bills = bills.data;
      })
      .catch(() => {
        this.billsError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
