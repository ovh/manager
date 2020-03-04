import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class OverTheBoxesCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
  }

  $onInit() {
    this.datagridId = 'dg-overtheboxes';
    this.defaultFilterColumn = 'serviceName';

    super.$onInit();

    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.overTheBoxStatusTypes.reduce(
          (statusTypes, statusType) => ({
            ...statusTypes,
            [statusType]: this.$translate.instant(
              `overtheboxes_status_label_${statusType}`,
            ),
          }),
          {},
        ),
      },
    };

    this.columnsConfig = [
      { name: 'serviceName', sortable: this.getSorting('serviceName') },
      {
        name: 'customerDescription',
        sortable: this.getSorting('customerDescription'),
      },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }
}
