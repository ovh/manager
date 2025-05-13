import clone from 'lodash/clone';
import get from 'lodash/get';

export default class HostingTabUserLogsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $filter,
    $stateParams,
    atInternet,
    Alerter,
    constants,
    Hosting,
    WucUser,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$filter = $filter;
    this.$stateParams = $stateParams;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.constants = constants;
    this.Hosting = Hosting;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: 'web::hosting::logs',
    });

    this.hosting = this.$scope.hosting;
    this.logs = this.$scope.logs;

    this.$scope.$on('hosting.userLogs.refresh', () => {
      this.refreshTableUserLogs();
    });

    this.WucUser.getUrlOf('guides').then((guides) => {
      this.guide = get(guides, 'hostingStatsLogs');
    });

    this.refreshTableUserLogs();
  }

  refreshTableUserLogs() {
    this.userLogs = null;

    return this.Hosting.getOwnLogs(this.$stateParams.productId)
      .then((ids) => {
        const userLogs = [];
        ids.sort();
        ids.forEach((id) => {
          this.Hosting.getUserLogs(this.$stateParams.productId, id).then(
            (logins) => {
              logins.sort();
              logins.forEach((login) => {
                const userLog = { id, login };
                userLogs.push(userLog);
              });
            },
          );
        });
        return userLogs;
      })
      .then((userLogs) => {
        this.userLogs = userLogs;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(err);
      });
  }

  transformItem(item) {
    if (item.transformed) {
      return this.$q((resolve) => resolve(item));
    }
    return this.Hosting.getUserLogsEntry(
      this.$stateParams.productId,
      item.id,
      item.login,
    )
      .then((originalLogEntry) => {
        const logEntry = clone(originalLogEntry);
        logEntry.id = item.id;
        logEntry.transformed = true;

        return logEntry;
      })
      .catch(() => ({
        id: item.id,
        login: item.login,
        transformed: true,
      }));
  }
}
