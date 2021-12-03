import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { formatDuration } from '../repayments.utils';

export default class TelecomTelephonyRepaymentsListCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
  }

  $onInit() {
    this.id = 'repayments';

    super.$onInit();

    this.formatDuration = formatDuration;

    this.statusColumnOptions = {
      hideOperators: true,
      values: this.statusEnum.reduce(
        (options, status) => ({
          ...options,
          [status]: this.$translate.instant(
            `telephony_repayments_grid_status_${status}`,
          ),
        }),
        {},
      ),
    };

    this.columnsConfig = [
      { name: 'calledNumber', sortable: this.getSorting('calledNumber') },
      { name: 'callingNumber', sortable: this.getSorting('callingNumber') },
      { name: 'startDate', sortable: this.getSorting('startDate') },
      { name: 'duration', sortable: this.getSorting('duration') },
      { name: 'buyAmount.value', sortable: this.getSorting('buyAmount.value') },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }
}
