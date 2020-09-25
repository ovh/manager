import get from 'lodash/get';

angular.module('App').controller(
  'HostingTabTasksCtrl',
  class HostingTabTasksCtrl {
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      atInternet,
      Alerter,
      Hosting,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.atInternet = atInternet;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.$q = $q;
    }

    $onInit() {
      this.atInternet.trackPage({ name: 'web::hosting::tasks' });

      this.states = {
        DOING: 'DOING',
        ERROR: 'ERROR',
        DONE: 'DONE',
        CANCELLED: 'CANCELLED',
        TODO: 'TODO',
        INIT: 'INIT',
      };
      this.tasksList = undefined;

      this.loadPaginated = this.loadPaginated.bind(this);

      this.$scope.$on(this.Hosting.events.tasksChanged, () => {
        this.$scope.$broadcast('paginationServerSide.reload', 'tasksTable');
      });
    }

    loadPaginated({ pageSize, offset }) {
      return this.$q
        .all({
          hosting: this.Hosting.getHosting(this.$stateParams.productId),
          tasks: this.Hosting.getTasksList(
            this.$stateParams.productId,
            pageSize,
            offset - 1,
          ),
        })
        .then(({ hosting, tasks }) => {
          this.hosting = hosting;
          this.tasksList = tasks;
          return {
            data: tasks.list.results,
            meta: {
              totalCount: tasks.count,
            },
          };
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_TASKS_error_message'),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
          return { meta: { totalCount: 0 } };
        });
    }

    refreshTable() {
      this.$scope.$broadcast('paginationServerSide.reload', 'tasksTable');
    }
  },
);
