import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default class FreefaxesCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, ouiDatagridService) {
    super();
    this.$q = $q;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = 'dg-freefaxes';
    this.defaultFilterColumn = 'number';

    super.$onInit();

    this.columnsConfig = [
      { name: 'number', sortable: this.getSorting('number') },
      { name: 'fromName', sortable: this.getSorting('fromName') },
      { name: 'fromEmail', sortable: this.getSorting('fromEmail') },
    ];
  }
}
