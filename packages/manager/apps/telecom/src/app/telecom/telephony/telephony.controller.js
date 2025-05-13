import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class TelecomTelephonyController extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService, CHANGELOG) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.datagridId = 'dg-telephony-billingAccounts';
    this.defaultFilterColumn = 'billingAccount';

    super.$onInit();

    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.telephonyStatusTypes.reduce(
          (statusTypes, statusType) => ({
            ...statusTypes,
            [statusType]: this.$translate.instant(
              `telephony_status_label_${statusType}`,
            ),
          }),
          {},
        ),
      },
    };

    this.columnsConfig = [
      { name: 'billingAccount', sortable: this.getSorting('billingAccount') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'numServices', sortable: false },
      {
        name: 'currentOutplan.value',
        sortable: this.getSorting('currentOutplan.value'),
      },
      {
        name: 'securityDeposit.value',
        sortable: this.getSorting('securityDeposit.value'),
      },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }
}
