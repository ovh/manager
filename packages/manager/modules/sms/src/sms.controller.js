import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class SmsCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService, CHANGELOG) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.datagridId = 'dg-sms';
    this.defaultFilterColumn = 'name';

    super.$onInit();

    this.filtersOptions = {
      channel: {
        hideOperators: true,
        values: this.smsChannelEnum.reduce(
          (smsChannels, smsChannel) => ({
            ...smsChannels,
            [smsChannel]: this.$translate.instant(`sms_channel_${smsChannel}`),
          }),
          {},
        ),
      },
      status: {
        hideOperators: true,
        values: this.smsStatusTypes.reduce(
          (statusTypes, statusType) => ({
            ...statusTypes,
            [statusType]: this.$translate.instant(
              `sms_status_label_${statusType}`,
            ),
          }),
          {},
        ),
      },
    };

    this.columnsConfig = [
      { name: 'name', sortable: this.getSorting('name') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'channel', sortable: this.getSorting('channel') },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }
}
