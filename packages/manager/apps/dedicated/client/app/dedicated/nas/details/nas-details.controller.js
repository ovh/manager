import indexOf from 'lodash/indexOf';

angular.module('App').controller(
  'NasDetailsCtrl',
  class NasDetailsCtrl {
    /* @ngInject */
    constructor(
      $stateParams,
      $scope,
      currentActiveLink,
      dashboardLink,
      partitionLink,
      Nas,
      Alerter,
      constants,
      coreURLBuilder,
      nasData,
    ) {
      // injections
      this.$stateParams = $stateParams;
      this.$scope = $scope;
      this.Nas = Nas;
      this.Alerter = Alerter;
      this.constants = constants;
      this.nasData = nasData;
      this.coreURLBuilder = coreURLBuilder;

      this.currentActiveLink = currentActiveLink;
      this.dashboardLink = dashboardLink;
      this.partitionLink = partitionLink;

      // attributes used in view
      this.alerterId = 'NasAlert';
      this.redirectToCloud = null;
      this.urlRenew = null;

      this.loaders = {
        nas: false,
        information: false,
      };

      this.nasData.nas.serviceName = this.Nas.getNasId(this.$stateParams.nasId);
      this.nasData.isNasHa =
        this.Nas.getNasType(this.$stateParams.nasId) === 'nasha';
    }

    startPoll(task) {
      this.Nas.poll(
        this.$stateParams.nasId,
        task.taskId ? task.taskId : task,
      ).then((taskPolled) => {
        if (indexOf(this.Nas.operations.partition, taskPolled.operation) >= 0) {
          this.$scope.$broadcast('nas_partitions_updated');
        }
        if (indexOf(this.Nas.operations.access, taskPolled.operation) >= 0) {
          this.$scope.$broadcast('nas_access_updated');
        }
        if (indexOf(this.Nas.operations.snapshot, taskPolled.operation) >= 0) {
          this.$scope.$broadcast('nas_snapshot_updated');
        }
      });
    }

    getTaskInProgress() {
      return this.Nas.getTaskInProgressOf(this.$stateParams.nasId).then(
        (tabTasks) => {
          angular.forEach(tabTasks, (task) => {
            this.startPoll(task);
          });
        },
      );
    }

    managePoll() {
      // kill poll on scope destroy
      this.$scope.$on('$destroy', () => {
        this.Nas.killPoll();
      });

      this.getTaskInProgress();
    }

    /**
     *  Load NAS
     */
    $onInit() {
      this.redirectToCloud = this.coreURLBuilder.buildURL(
        'dedicated',
        '#/paas/nasha/:nashaId/partitions',
        { nashaId: this.nasData.nas.serviceName },
      );
      this.managePoll(); // who is poll ? :-P

      this.loaders.nas = true;
      this.Nas.getSelected(this.$stateParams.nasId).then(
        (currentNas) => {
          this.nasData.nas = currentNas;
          this.loaders.nas = false;
          this.urlRenew = this.Nas.getUrlRenew(this.$stateParams.nasId);
          this.nasData.monitoring.enabled = currentNas.monitored;
        },
        (data) => {
          this.loaders.nas = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant('nas_dashboard_loading_error'),
            data,
            this.alerterId,
          );
        },
      );

      this.loaders.information = true;
      this.Nas.getServiceInfos(this.$stateParams.nasId).then(
        (information) => {
          this.nasData.information = information;
          this.loaders.information = false;
        },
        (data) => {
          this.loaders.information = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant('nas_dashboard_loading_error'),
            data,
            this.alerterId,
          );
        },
      );

      // watchers
      this.$scope.$on('nas.informations.reload', () => {
        this.$scope.loadNas();
      });

      this.$scope.$on('nas_launch_task', (e, task) => {
        if (task) {
          this.startPoll(task);
        } else {
          this.getTaskInProgress();
        }
      });
    }
  },
);
