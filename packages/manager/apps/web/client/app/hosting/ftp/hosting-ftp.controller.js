import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

angular.module('App').controller(
  'HostingTabFTPCtrl',
  class HostingTabFTPCtrl {
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      $translate,
      atInternet,
      Alerter,
      Hosting,
      HostingUser,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.atInternet = atInternet;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingUser = HostingUser;
    }

    $onInit() {
      this.atInternet.trackPage({ name: 'web::hosting::ftp' });

      this.primaryUser = null;
      this.allowUpdateState = true;
      this.displayFtpExplorer = true;
      this.disableRestoreFtp = false;
      this.displayRestoreFtp = true;
      this.editMode = false;
      this.ftpInformations = null;
      this.hasResult = false;
      this.loading = {
        ftp: false,
        init: true,
      };
      this.password = {
        value: null,
      };
      this.search = {
        value: null,
      };

      this.$scope.loadFtpInformations = (count, offset) =>
        this.loadFtpInformations(count, offset);

      this.$scope.$on(this.Hosting.events.tabFtpRefresh, () => {
        if (get(this.ftpInformations, 'hasMultiFtp', false)) {
          this.loading.init = true;
          this.hasResult = false;
          this.$scope.$broadcast('paginationServerSide.reload');
        }
      });
      this.$scope.$on(this.Hosting.events.tasksChanged, () => {
        this.disableRestoreFtp = true;
      });
      this.$scope.$on('hosting.web.ftp.user.poll.start', () => {
        this.allowUpdateState = false;
      });
      this.$scope.$on('hosting.web.ftp.user.poll.done', () => {
        this.allowUpdateState = true;
        this.Alerter.resetMessage(this.$scope.alerts.main);
      });
      this.$scope.$on('$destroy', () => {
        this.HostingUser.killAllPolling({
          namespace: 'hosting.web.ftp.user.poll',
        });
      });

      this.condition = this.Hosting.constructor.getPasswordConditions();

      return this.Hosting.getSelected(this.$stateParams.productId)
        .then((hosting) => {
          // backup snapshots are made at least one day after service creation,
          // so hide backup option in the meantime
          if (moment(hosting.creation).isAfter(moment().subtract(1, 'days'))) {
            this.displayRestoreFtp = false;
          }

          if (isEmpty(hosting.offer)) {
            return this.$q.when();
          }

          this.startPolling();
          return this.$q.all({
            tab: this.loadTab(10, 0, false),
            capabilities: this.Hosting.getOfferCapabilities(hosting.offer),
          });
        })
        .then(({ capabilities }) => {
          this.displayFtpExplorer = get(capabilities, 'filesBrowser', false);
        });
    }

    resetSearch() {
      this.search.value = '';
      this.goSearch();
    }

    goSearch() {
      if (!isEmpty(this.search.value)) {
        this.loading.search = true;
      }

      this.$scope.$broadcast('paginationServerSide.loadPage', 1);
    }

    loadFtpInformations(count, offset) {
      this.loading.ftp = true;
      this.loadTab(count, offset, true);
    }

    loadTab(count, offset, needUsers) {
      return this.Hosting.getTabFTP(
        this.$stateParams.productId,
        count,
        offset,
        needUsers,
        this.search.value,
      )
        .then((ftpInformations) => {
          if (
            ftpInformations != null &&
            !isEmpty(ftpInformations.list.results)
          ) {
            const firstUserCredentials =
              ftpInformations.list.results[0].serviceManagementCredentials;
            this.hasResult = true;
            this.firstUser = {
              ftp: firstUserCredentials.ftp,
              ftpUrl: `ftp://${firstUserCredentials.ftp.user}@${firstUserCredentials.ftp.url}:${firstUserCredentials.ftp.port}/`,
              ssh: firstUserCredentials.ssh,
              sshUrl: `ssh://${firstUserCredentials.ssh.user}@${firstUserCredentials.ssh.url}:${firstUserCredentials.ssh.port}/`,
            };
          }

          /* eslint-disable no-param-reassign */
          forEach(ftpInformations.list.results, (user) => {
            user.ftp = user.serviceManagementCredentials.ftp;
            user.ftpUrl = `ftp://${user.serviceManagementCredentials.ftp.user}@${user.serviceManagementCredentials.ftp.url}:${user.serviceManagementCredentials.ftp.port}/`;
            user.ssh = user.serviceManagementCredentials.ssh;
            user.sshUrl = `ssh://${user.serviceManagementCredentials.ssh.user}@${user.serviceManagementCredentials.ssh.url}:${user.serviceManagementCredentials.ssh.port}/`;

            this.primaryUser = user.isPrimaryAccount ? user : null;
          });
          /* eslint-enable no-param-reassign */

          this.primaryUserEnabled =
            ftpInformations.list.results.length &&
            ftpInformations.list.results[0].isPrimaryAccount
              ? ftpInformations.list.results[0].state === 'RW'
              : null;
          this.ftpInformations = ftpInformations;
        })
        .finally(() => {
          this.loading.ftp = false;
          this.loading.init = false;
        });
    }

    refreshTable() {
      if (!this.loading.ftp) {
        this.$scope.$broadcast('paginationServerSide.reload');
      }
    }

    changePassword() {
      this.HostingUser.changePassword(
        this.$stateParams.productId,
        this.ftpInformations.primaryLogin,
        this.password.value,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_change_password_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_change_password_fail',
              { t0: this.ftpInformations.primaryLogin },
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.password.value = null;
          this.editMode = false;
        });
    }

    resetPassword() {
      this.password.value = null;
      this.editMode = false;
    }

    modifyUser(user) {
      this.$scope.setAction('ftp/user/update/hosting-ftp-user-update', {
        user: omit(user, 'ssh', 'ftp', 'ftpUrl', 'sshUrl'),
        ftpInformations: this.ftpInformations,
      });
    }

    isPasswordValid() {
      return this.Hosting.constructor.isPasswordValid(this.password.value);
    }

    openFtpExplorer() {
      window.open(this.ftpInformations.ftpExplorer, '_blank');
    }

    updatePrimaryLoginState(element, prev) {
      const user = angular.copy(element);
      delete user.isPrimaryAccount;

      this.HostingUser.updateUser(this.$stateParams.productId, {
        login: user.login,
        data: omit(user, 'ssh', 'ftp', 'ftpUrl', 'sshUrl'),
      })
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_user_modify_success',
            ),
            this.$scope.alerts.main,
          );
          this.startPolling();
        })
        .catch((err) => {
          const idx = indexOf(this.ftpInformations.list.result, element);
          this.ftpInformations.list.result[idx] = assign(element, prev);
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_user_modify_fail',
            ),
            err,
            this.$scope.alerts.main,
          );
        });
    }

    startPolling() {
      this.HostingUser.getTasks(this.$stateParams.productId, {
        params: { function: 'user/update' },
      }).then((tasks) => {
        this.HostingUser.pollState(this.$stateParams.productId, {
          id: tasks[0],
          successSates: ['done', 'cancelled'],
          namespace: 'hosting.web.ftp.user.poll',
        });
      });

      this.HostingUser.getTasks(this.$stateParams.productId, {
        params: { function: 'web/restoreSnapshot' },
      }).then((tasks) => {
        if (tasks.length > 0) {
          this.disableRestoreFtp = true;
        }
      });
    }
  },
);
