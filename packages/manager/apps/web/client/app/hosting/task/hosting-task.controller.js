import get from 'lodash/get';
import {
  HOSTING_TASK_TABLE_ID,
  HOSTING_TASK_STATUS,
} from './hosting-task.constants';

angular.module('App').controller(
  'HostingTabTasksCtrl',
  class HostingTabTasksCtrl {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      atInternet,
      Alerter,
      Hosting,
      ouiDatagridService,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.atInternet = atInternet;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.$q = $q;
      this.ouiDatagridService = ouiDatagridService;
      this.datagridId = HOSTING_TASK_TABLE_ID;
      this.HOSTING_TASK_STATUS = HOSTING_TASK_STATUS;
    }

    $onInit() {
      this.atInternet.trackPage({ name: 'web::hosting::tasks' });

      this.tasksList = undefined;

      this.loadPaginated = this.loadPaginated.bind(this);

      this.$scope.$on(this.Hosting.events.tasksChanged, () => {
        this.$scope.$broadcast('paginationServerSide.reload', 'tasksTable');
      });
    }

    loadPaginated({ pageSize, offset }) {
      this.isLoading = true;
      return this.$q
        .all({
          hosting: this.Hosting.getHosting(this.$stateParams.productId),
          tasks: this.Hosting.getTasksList(
            this.$stateParams.productId,
            pageSize,
            Math.ceil(offset / pageSize),
          ),
        })
        .then(({ hosting, tasks }) => {
          this.hosting = hosting;
          this.tasksList = tasks;
          return tasks;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_TASKS_error_message'),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
          return { meta: { totalCount: 0 } };
        })
        .finally(() => {
          this.isLoading = false;
        });
    }

    refreshTable() {
      return this.ouiDatagridService.refresh(this.datagridId, true);
    }
  },
);
