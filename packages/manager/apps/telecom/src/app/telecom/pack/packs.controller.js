import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class TelecomPacksController extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService, CHANGELOG) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.datagridId = 'dg-telephony-packs';
    this.defaultFilterColumn = 'description';

    super.$onInit();

    this.columnsConfig = [
      { name: 'packName', sortable: this.getSorting('packName') },
      { name: 'description', sortable: this.getSorting('description') },
    ];
  }
}
