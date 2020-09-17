import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

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
    // Injections
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
    const filter = $criteria.map((criteria) => ({
      field: get(criteria, 'property'),
      comparator: criteria.operator,
      reference: [criteria.value],
    }));

    this.onListParamsChange({
      filters: JSON.stringify(filter),
    });
  }

  /**
   *  Apply debt object to bill objects returned by an apiv7 batch call.
   */
  applyDebtToBills(bills) {
    let billDebtsPromise = this.$q.when([]);

    if (this.debtAccount.active) {
      billDebtsPromise = this.OvhApiMe.Bill()
        .v7()
        .debt()
        .batch('billId', map(bills, 'key'))
        .execute().$promise;
    }

    return billDebtsPromise.then((debts) =>
      map(bills, (bill) => {
        const debt = find(debts, {
          path: `/me/bill/${bill.key}/debt`,
        });

        return set(bill, 'value.debt', get(debt, 'value', null));
      }),
    );
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

  exportToCsv() {
    // fetch upto 150 bills in single ajax call
    // we can not increase more than 150, if we do that API
    // GET /apiv7/me/bill/{{bill-ids}}/debt?$batch=,
    // url length goes behind safe limit 2083
    const limit = 150;
    this.loading.export = true;

    const translations = {
      notAvailable: this.$translate.instant(
        'billing_main_history_table_unavailable',
      ),
      dueImmediatly: this.$translate.instant(
        'billing_main_history_table_immediately',
      ),
      paid: this.$translate.instant('billing_main_history_table_debt_paid'),
    };
    const headers = [
      this.$translate.instant('billing_main_history_table_id'),
      this.$translate.instant('billing_main_history_table_order_id'),
      this.$translate.instant('billing_main_history_table_date'),
      this.$translate.instant('billing_main_history_table_total'),
      this.$translate.instant('billing_main_history_table_total_with_VAT'),
    ];

    if (this.debtAccount.active) {
      headers.push(
        this.$translate.instant(
          'billing_main_history_table_balance_due_amount',
        ),
      );
      headers.push(
        this.$translate.instant('billing_main_history_table_balance_due_date'),
      );
    }

    let fetchedBills = 0;
    const billsPromises = [];
    while (fetchedBills < this.totalBills) {
      const billsPromise = this.getApiv7Request()
        .expand()
        .offset(fetchedBills)
        .limit(limit)
        .execute()
        .$promise.then((bills) => this.applyDebtToBills(bills));
      billsPromises.push(billsPromise);
      fetchedBills += limit;
    }
    return this.$q
      .all(billsPromises)
      .then((response) => flatten(response))
      .then((billList) => {
        const rows = map(billList, 'value').map((bill) => {
          let row = [
            bill.billId,
            bill.orderId,
            moment(bill.date).format('L'),
            bill.priceWithoutTax.text,
            bill.priceWithTax.text,
          ];

          if (this.debtAccount.active) {
            if (!bill.debt) {
              row.concat([
                translations.notAvailable,
                translations.notAvailable,
              ]);
            }
            const dueAmount = get(
              bill,
              'debt.dueAmount.text',
              translations.notAvailable,
            );
            let dueDate;
            if (get(bill, 'debt.dueAmount.value', 0) > 0) {
              dueDate = get(bill, 'debt.dueDate')
                ? moment(bill.debt.dueDate).format('L')
                : translations.dueImmediatly;
            } else {
              dueDate = translations.paid;
            }
            row = row.concat([dueAmount, dueDate]);
          }

          return row;
        });
        return [headers].concat(rows);
      })
      .then((csvData) =>
        this.exportCsv.exportData({
          separator: ',',
          datas: csvData,
        }),
      )
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_main_history_export_error'),
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

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

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
            this.$translate.instant('billing_main_history_loading_errors'),
            get(error, 'data.message'),
          ].join(' '),
          'billing_main_alert',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
