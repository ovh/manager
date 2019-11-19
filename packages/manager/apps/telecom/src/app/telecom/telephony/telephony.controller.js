import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default class TelecomTelephonyController extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
  ) {
    super();
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = 'dg-telephony-billingAccounts';
    this.defaultFilterColumn = 'description';

    super.$onInit();

    this.columnsConfig = [
      { name: 'description', sortable: this.getSorting('description') },
    ];
  }
}
