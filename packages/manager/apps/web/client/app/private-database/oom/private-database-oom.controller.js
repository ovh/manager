import clone from 'lodash/clone';
import findIndex from 'lodash/findIndex';

angular.module('App').controller(
  'PrivateDatabaseOomCtrl',
  class PrivateDatabaseOomCtrl {
    constructor(
      $scope,
      $q,
      $stateParams,
      $translate,
      Alerter,
      OomService,
      PrivateDatabase,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.oomService = OomService;
      this.privateDatabaseService = PrivateDatabase;
    }

    $onInit() {
      this.isLoading = true;
      this.productId = this.$stateParams.productId;

      this.NB_DAY_OOM = 7;
      this.NB_MAX_OOM = 100;

      this.displayType = {
        classic: {
          key: 'premium',
          value: this.$translate.instant(
            'privateDatabase_order_sql_type_premium_label',
          ),
        },
        public: {
          key: 'dbaas',
          value: this.$translate.instant(
            'privateDatabase_order_sql_type_dbaas_label',
          ),
        },
      };

      this.database = this.$scope.currentActionData.database;

      this.$scope.orderMoreRam = () => this.orderMoreRam();

      this.getOom();

      return this.privateDatabaseService
        .canOrderRam(this.productId)
        .then((canOrderRam) => {
          this.canOrderRam = canOrderRam;
        })
        .finally(() => {
          this.isLoading = false;
        });
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
      const idx = findIndex(this.oomList, item);

      if (idx <= 0) {
        return -1;
      }
      const now = moment(item.date);
      const end = moment(this.oomList[idx - 1].date);

      return moment.duration(now.diff(end)).humanize();
    }

    transformItem(original) {
      const item = clone(original);
      item.uptime = this.getUptime(item);

      item.overflow = filesize(item.sizeReached, { output: 'object' });
      return item;
    }
  },
);
