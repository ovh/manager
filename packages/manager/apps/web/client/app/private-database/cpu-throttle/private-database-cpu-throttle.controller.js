import clone from 'lodash/clone';

angular.module('App').controller(
  'PrivateDatabaseCpuThrottleCtrl',
  class PrivateDatabaseCpuThrottleCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $q,
      $stateParams,
      $translate,
      Alerter,
      CpuThrottleService,
      PrivateDatabase,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.cpuThrottleService = CpuThrottleService;
      this.privateDatabaseService = PrivateDatabase;
    }

    $onInit() {
      this.isLoading = true;
      this.productId = this.$stateParams.productId;

      this.NB_DAY_CPU_THROTTLE = 7;
      this.NB_MAX_CPU_THROTTLE = 100;

      this.database = this.$scope.currentActionData.database;

      this.getCpuThrottle();

      this.isLoading = false;
    }

    getCpuThrottle() {
      this.cpuThrottleList = this.database.cpuThrottle.list.reverse();
    }

    static generateDuration(original) {
      const item = clone(original);

      let endMoment = item.endDate;
      if (endMoment == null) {
        endMoment = moment();
      }

      item.duration = moment
        .duration(moment(endMoment).diff(moment(item.startDate)))
        .humanize();

      return item;
    }
  },
);
