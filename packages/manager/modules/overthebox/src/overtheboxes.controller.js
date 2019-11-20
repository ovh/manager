import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default class OverTheBoxesCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, ouiDatagridService) {
    super();
    this.$q = $q;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = 'dg-overtheboxes';
    this.defaultFilterColumn = 'serviceName';

    super.$onInit();

    this.columnsConfig = [
      { name: 'serviceName', sortable: this.getSorting('serviceName') },
      { name: 'customerDescription', sortable: this.getSorting('customerDescription') },
    ];
  }
}
