import clone from 'lodash/clone';
import get from 'lodash/get';

angular.module('App').controller(
  'HostingTabUserLogsCtrl',
  class HostingTabUserLogsCtrl {
    constructor(
      $scope,
      $q,
      $filter,
      $stateParams,
      Alerter,
      constants,
      Hosting,
      User,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$filter = $filter;
      this.$stateParams = $stateParams;
      this.Alerter = Alerter;
      this.constants = constants;
      this.Hosting = Hosting;
      this.User = User;
    }

    $onInit() {
      this.hosting = this.$scope.hosting;
      this.logs = this.$scope.logs;
      this.userLogsToken = null;

      this.$scope.$on('hosting.userLogs.refresh', () => {
        this.refreshTableUserLogs();
      });

      this.Hosting.getUserLogsToken(this.$stateParams.productId, {
        params: {
          remoteCheck: true,
          ttl: 3600,
        },
      }).then((token) => {
        this.userLogsToken = token;
      });

      this.User.getUrlOf('guides').then((guides) => {
        this.guide = get(guides, 'hostingStatsLogs');
      });

      this.refreshTableUserLogs();
    }

    refreshTableUserLogs() {
      this.userLogs = null;

      return this.Hosting.getUserLogs(this.$stateParams.productId)
        .then((data) => data.sort())
        .then((ids) => {
          this.userLogs = ids.map((id) => ({ id }));
          return this.userLogs;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(err);
        });
    }

    transformItem(item) {
      if (item.transformed) {
        return this.$q((resolve) => resolve(item));
      }
      return this.Hosting.getUserLogsEntry(this.$stateParams.productId, item.id)
        .then((originalLogEntry) => {
          const logEntry = clone(originalLogEntry);
          logEntry.id = item.id;
          logEntry.transformed = true;

          return logEntry;
        })
        .catch(() => ({
          id: item.id,
          login: item.id,
          transformed: true,
        }));
    }
  },
);
