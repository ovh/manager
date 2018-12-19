import filesize from 'filesize';
import _ from 'lodash';
import moment from 'moment';

export default class PrivateDatabaseOomCtrl {
  /* @ngInject */

  constructor($scope, $q, $stateParams, $translate, Alerter, OomService) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.oomService = OomService;
  }

  $onInit() {
    this.productId = this.$stateParams.serviceName;

    this.NB_DAY_OOM = 7;
    this.NB_MAX_OOM = 100;

    this.displayType = {
      classic: {
        key: 'premium',
        value: this.$translate.instant('privateDatabase_order_sql_type_premium_label'),
      },
      public: {
        key: 'dbaas',
        value: this.$translate.instant('privateDatabase_order_sql_type_dbaas_label'),
      },
    };

    this.database = this.$scope.currentActionData.database;

    this.$scope.orderMoreRam = () => this.orderMoreRam();

    this.getOom();
  }

  getOom() {
    this.oomList = this.database.oom.list.reverse();
  }

  orderMoreRam() {
    if (this.database.oom.realList.length >= this.database.oom.nbOomError) {
      this.$scope.setAction(
        'database/ram/update/private-database-database-ram-update',
        this.database,
      );
    } else {
      this.$scope.resetAction();
    }
  }

  getUptime(item) {
    const idx = _.findIndex(this.oomList, item);

    if (idx <= 0) {
      return -1;
    }
    const now = moment(item.date);
    const end = moment(this.oomList[idx - 1].date);

    return moment.duration(now.diff(end)).humanize();
  }

  transformItem(original) {
    const item = _(original).clone();
    item.uptime = this.getUptime(item);

    item.overflow = filesize(item.sizeReached, { output: 'object' });
    return item;
  }
}
