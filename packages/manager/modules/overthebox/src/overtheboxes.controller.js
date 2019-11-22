import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default class OverTheBoxesCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService) {
    super();
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = 'dg-overtheboxes';
    this.defaultFilterColumn = 'serviceName';

    super.$onInit();

    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.overTheBoxStatusTypes.reduce((statusTypes, statusType) => ({
          ...statusTypes,
          [statusType]: this.$translate.instant(`overtheboxes_status_label_${statusType}`),
        }), {}),
      },
    };

    this.columnsConfig = [
      { name: 'serviceName', sortable: this.getSorting('serviceName') },
      { name: 'customerDescription', sortable: this.getSorting('customerDescription') },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }
}
