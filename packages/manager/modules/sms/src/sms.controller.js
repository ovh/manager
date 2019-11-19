import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default class SmsCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, ouiDatagridService) {
    super();
    this.$q = $q;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = 'dg-sms';
    this.defaultFilterColumn = 'name';

    super.$onInit();

    this.columnsConfig = [
      { name: 'name', sortable: this.getSorting('name') },
      { name: 'description', sortable: this.getSorting('description') },
    ];
  }
}
