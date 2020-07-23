import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import get from 'lodash/get';

export default class BillingMainHistoryCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $uibModal,
    Alerter,
    atInternet,
    ouiDatagridService,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
  }

  trackInvoiceOpening() {
    this.atInternet.trackClick({
      name: 'open_invoices',
      type: 'action',
      chapter1: 'billing',
      chapter2: 'invoices',
    });
  }

  exportAll(format) {
    return this.export(format, this.bills);
  }

  exportSelection(format) {
    return this.export(
      format,
      this.selectedBills.map(({ billId }) => billId),
    );
  }

  export(format, bills) {
    this.atInternet.trackClick({
      name: `export_${format}`,
      type: 'action',
      chapter1: 'billing',
      chapter2: 'invoices',
      chapter3: 'export',
    });
    return this.exportBills(format, bills)
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('billing_main_history_table_export_success'),
          'billing_main_alert',
        ),
      )
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_main_history_table_export_error'),
            get(error, 'data.message'),
          ].join(' '),
          'billing_main_alert',
        );
      });
  }

  onRowSelect($rows) {
    this.selectedBills = $rows;
  }

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

  $onInit() {
    this.selectedBills = [];

    super.$onInit();

    this.postalMailOptions = {
      enabled: !!this.invoicesByPostalMail,
      activated: get(this.invoicesByPostalMail, 'data', false),
    };

    this.columnsConfig = [
      { name: 'billId', sortable: this.getSorting('billId') },
      { name: 'orderId', sortable: this.getSorting('orderId') },
      { name: 'date', sortable: this.getSorting('date') },
      {
        name: 'priceWithoutTax.value',
        sortable: this.getSorting('priceWithoutTax.value'),
      },
      {
        name: 'priceWithTax.value',
        sortable: this.getSorting('priceWithTax.value'),
      },
      { name: 'debt.dueAmount', sortable: this.getSorting('debt.dueAmount') },
      { name: 'debt.status', sortable: this.getSorting('debt.status') },
    ];
  }
}
