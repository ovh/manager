import get from 'lodash/get';

angular.module('App').controller(
  'HostingDatabaseDumpAddCtrl',
  class HostingDatabaseDumpCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, HostingDatabase, Alerter) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.HostingDatabase = HostingDatabase;
      this.Alerter = Alerter;
    }

    $onInit() {
      this.model = {};
      this.entryToDump = this.$scope.currentActionData;

      this.loadOptions();

      this.$scope.dumpDatabase = () => this.dumpDatabase();
    }

    static getDate(day) {
      switch (day) {
        case 'NOW':
          return Date.now();
        case 'DAILY_1':
          return Date.now() - 24 * 3600 * 1000;
        case 'WEEKLY_1':
          return Date.now() - 24 * 3600 * 7 * 1000;
        default:
          return '';
      }
    }

    loadOptions() {
      this.HostingDatabase.dumpDatabaseOptions()
        .then((data) => {
          this.model.options = data;
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_dump_step1_loaderror',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          ),
        );
    }

    dumpDatabase() {
      this.HostingDatabase.dumpDatabase(
        this.$stateParams.productId,
        this.entryToDump,
        this.model.date,
        true,
      )
        .then(() =>
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_dump_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_dump_fail',
              {
                t0: this.entryToDump,
              },
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => this.$scope.resetAction());
    }
  },
);
