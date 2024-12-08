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

  trackInvoiceOpening(format) {
    this.atInternet.trackClick({
      name: `open-invoices-${format}`,
      type: 'action',
      chapter1: 'billing',
      chapter2: 'invoices',
    });
  }

  trackExport(exportType) {
    this.atInternet.trackClick({
      name: `export-${exportType}`,
      type: 'action',
      chapter1: 'billing',
      chapter2: 'invoices',
      chapter3: 'export',
    });
  }

  exportAll(format) {
    this.trackExport(format);
    return this.export(format, this.bills);
  }

  exportSelection(format) {
    this.trackExport(`${format}-select`);
    return this.export(
      format,
      this.selectedBills.map(({ billId }) => billId),
    );
  }

  export(format, bills) {
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
    this.defaultFilterColumn = 'billId';

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
    ];
  }
}
