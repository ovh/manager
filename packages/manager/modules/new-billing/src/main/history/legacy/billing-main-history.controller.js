import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

function applyBillCriteria(request, $config) {
  let result = request;
  $config.criteria.forEach((criteria) => {
    if (criteria.operator === 'contains') {
      result = result.addFilter(
        criteria.property || 'billId',
        'like',
        `*${criteria.value}*`,
      );
    } else if (criteria.operator === 'is' && criteria.property === 'date') {
      result = result.addFilter('date', 'like', `${criteria.value}*`);
    } else if (
      criteria.operator === 'isAfter' &&
      criteria.property === 'date'
    ) {
      result = result.addFilter('date', 'gt', criteria.value);
    } else if (
      criteria.operator === 'isBefore' &&
      criteria.property === 'date'
    ) {
      result = result.addFilter('date', 'lt', criteria.value);
    }
  });
  return result;
}

export default class BillingMainHistoryCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $state,
    $translate,
    $uibModal,
    Alerter,
    atInternet,
    coreConfig,
    exportCsv,
    OvhApiMe,
    ovhPaymentMethod,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.exportCsv = exportCsv;
    this.OvhApiMe = OvhApiMe;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // Other attributes used in view
    this.loading = {
      init: false,
      export: false,
    };

    this.postalMailOptions = {
      enabled: false,
      activated: false,
    };

    this.datagridConfig = null;
    this.totalBills = 0;
  }

  onCriteriaChange($criteria) {
    const newFilter = $criteria.map((criteria) => ({
      field: get(criteria, 'property'),
      comparator: criteria.operator,
      reference: [criteria.value],
    }));

    this.onListParamsChange({
      filters: JSON.stringify(newFilter),
    });
  }

  trackInvoiceOpening() {
    this.atInternet.trackClick({
      name: 'open_invoices',
      type: 'action',
      chapter1: 'billing',
      chapter2: 'invoices',
    });
  }

  /* ===============================
  =            DATAGRID            =
  ================================ */

  getBills($config) {
    let req = this.OvhApiMe.Bill()
      .Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .offset(Math.ceil($config.offset / ($config.pageSize || 1)))
      .limit($config.pageSize);

    if ($config.sort) {
      req = req.sort(
        $config.sort.property,
        $config.sort.dir > 0 ? 'ASC' : 'DESC',
      );
    }

    return applyBillCriteria(req, $config)
      .execute(null)
      .$promise.then((result) => ({
        data: result.data,
        meta: {
          totalCount:
            parseInt(result.headers['x-pagination-elements'], 10) || 0,
        },
      }));
  }

  /* -----  End of DATAGRID  ------ */

  /* ====================================
  =            EXPORT TO CSV            =
  ===================================== */

  fetchAll(route) {
    let result = [];
    const fetchPart = (page) => {
      return this.$http
        .get(route, {
          serviceType: 'apiv6',
          headers: {
            'X-Pagination-Mode': 'CachedObjectList-Pages',
            'X-Pagination-Size': '5000',
            'X-Pagination-Number': `${page}`,
          },
        })
        .then(({ data }) => {
          if (data.length) {
            result = result.concat(data);
            return fetchPart(page + 1);
          }
          return result;
        });
    };
    return fetchPart(1);
  }

  fetchAllBills() {
    return this.fetchAll('/me/bill');
  }

  fetchAllDebts() {
    return this.fetchAll('/me/debtAccount/debt');
  }

  exportToCsv() {
    this.loading.export = true;
    const csvHeaders = [
      this.$translate.instant('billing_main_history_legacy_table_id'),
      this.$translate.instant('billing_main_history_legacy_table_order_id'),
      this.$translate.instant('billing_main_history_legacy_table_date'),
      this.$translate.instant('billing_main_history_legacy_table_total'),
      this.$translate.instant(
        'billing_main_history_legacy_table_total_with_VAT',
      ),
      this.$translate.instant(
        'billing_main_history_legacy_table_balance_due_amount',
      ),
      this.$translate.instant(
        'billing_main_history_legacy_table_balance_due_date',
      ),
    ];

    const getDueDate = (bill) => {
      if (get(bill, 'debt.dueAmount.value', 0) > 0) {
        return get(bill, 'debt.dueDate')
          ? moment(bill.debt.dueDate).format('L')
          : this.$translate.instant(
              'billing_main_history_legacy_table_immediately',
            );
      }
      return this.$translate.instant(
        'billing_main_history_legacy_table_debt_paid',
      );
    };

    const getDebtAmount = (bill) => {
      if (bill.debt) {
        return get(
          bill,
          'debt.dueAmount.text',
          this.$translate.instant(
            'billing_main_history_legacy_table_unavailable',
          ),
        );
      }
      return '0';
    };

    return this.$q
      .all({
        bills: this.fetchAllBills(),
        debts: this.fetchAllDebts(),
      })
      .then(({ bills, debts }) => {
        debts.forEach((debt) => {
          filter(bills, { orderId: debt.orderId }).forEach((bill) => {
            bill.debt = debt; // eslint-disable-line
          });
        });
        this.exportCsv.exportData({
          separator: ',',
          datas: [csvHeaders].concat(
            map(sortBy(bills, 'date'), (bill) => {
              return [
                bill.billId,
                bill.orderId,
                moment(bill.date).format('L'),
                bill.priceWithoutTax.text,
                bill.priceWithTax.text,
                getDebtAmount(bill),
                getDueDate(bill),
              ];
            }),
          ),
        });
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_main_history_legacy_export_error'),
            get(error, 'data.message'),
          ].join(' '),
          'billing_main_alert',
        );
      })
      .finally(() => {
        this.loading.export = false;
        this.atInternet.trackClick({
          name: 'export_csv',
          type: 'action',
          chapter1: 'billing',
          chapter2: 'invoices',
          chapter3: 'export',
        });
      });
  }

  /* -----  End of EXPORT TO CSV  ------ */

  /* =============================
  =            EVENTS            =
  ============================== */

  onPostalMailOptionsChange() {
    const postalOptionsModal = this.$uibModal.open({
      templateUrl:
        'billing/main/history/postalMailOptions/billing-main-history-postal-mail-options.html',
      controller: 'BillingHistoryPostalMailOptionsCtrl',
      controllerAs: '$ctrl',
      resolve: {
        postalMailOptionsActivated: () => !this.postalMailOptions.activated,
      },
    });

    return postalOptionsModal.result.catch(() => {
      // reset the checkbox state in case modal is closed without confirm
      this.postalMailOptions.activated = !this.postalMailOptions.activated;
    });
  }

  /* -----  End of EVENTS  ------ */

  getDebtAccount() {
    return this.OvhApiMe.DebtAccount()
      .v6()
      .get()
      .$promise.catch((error) => {
        if (error.status === 404) {
          return {
            active: false,
          };
        }

        return this.$q.reject(error);
      });
  }

  $onInit() {
    this.criteria = JSON.parse(this.filters).map((criteria) => ({
      property: get(criteria, 'field'),
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

    let postalMailOptionPromise = this.$q.when(null);

    this.loading.init = true;

    if (
      this.coreConfig.isRegion('EU') &&
      this.currentUser.billingCountry === 'FR' &&
      this.currentUser.legalform === 'individual'
    ) {
      postalMailOptionPromise = this.OvhApiMe.Billing()
        .InvoicesByPostalMail()
        .v6()
        .get().$promise;
    }

    return this.$q
      .all({
        debtAccount: this.getDebtAccount(),
        hasDefaultPaymentMethod: this.ovhPaymentMethod.hasDefaultPaymentMethod(),
        invoicesByPostalMail: postalMailOptionPromise,
      })
      .then(
        ({ debtAccount, hasDefaultPaymentMethod, invoicesByPostalMail }) => {
          this.debtAccount = debtAccount;
          this.debtAccount.active =
            get(debtAccount, 'active') ||
            get(debtAccount, 'todoAmount.value') > 0 ||
            get(debtAccount, 'dueAmount.value') > 0;
          this.hasDefaultPaymentMethod = hasDefaultPaymentMethod;

          // set invoice by postal mail options
          this.postalMailOptions.enabled = invoicesByPostalMail !== null;
          this.postalMailOptions.activated = get(
            invoicesByPostalMail,
            'data',
            false,
          );
        },
      )
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant(
              'billing_main_history_legacy_loading_errors',
            ),
            get(error, 'data.message'),
          ].join(' '),
          'billing_main_alert',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  getDebt(bill) {
    return this.$http
      .get(`/me/bill/${bill.billId}/debt`)
      .then(({ data: debt }) => {
        return {
          ...bill,
          debt,
        };
      })
      .catch((error) => {
        // If there is no debt means the bill has been payed
        // API return a 404 if there is no debt
        if (error.status === 404) {
          return {
            ...bill,
            debt: {
              dueAmount: {
                value: 0,
                text: bill.priceWithTax.text.replace(/([0-9]|\.|,)+/g, '0.00'),
              },
            },
          };
        }
        return bill;
      });
  }
}
