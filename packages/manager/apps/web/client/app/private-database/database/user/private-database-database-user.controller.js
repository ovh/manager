import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

angular.module('App').controller(
  'PrivateDatabaseUserDatabaseCtrl',
  class PrivateDatabaseUserDatabaseController {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      Alerter,
      PrivateDatabase,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.privateDatabaseService = PrivateDatabase;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;
      this.database = this.$scope.bdd;

      this.loading = {
        init: false,
      };

      this.grants = ['admin', 'rw', 'ro', 'none'];

      this.pendingGrant = {};

      this.getUsers();

      forEach(['Start', 'Error', 'Done'], (state) => {
        this.$scope.$on(
          `privateDatabase.grant.set.${state.toLowerCase()}`,
          this[`onUserGrant${state}`].bind(this),
        );
      });
    }

    $onDestroy() {
      this.privateDatabaseService.killPollUserGrant();
    }

    getUsers() {
      this.loading.init = true;
      this.users = null;

      return this.privateDatabaseService
        .getUsers(this.productId)
        .then((users) => {
          this.users = users;
        })
        .finally(() => {
          if (isEmpty(this.users)) {
            this.loading.init = false;
          }
        });
    }

    transformItem(userName) {
      return this.privateDatabaseService
        .getUserGrants(this.productId, userName)
        .then((res) => ({
          userName,
          grantType: res[this.database.databaseName].value,
          database: res[this.database.databaseName],
        }));
    }

    onTransformItemDone() {
      this.loading.init = false;
    }

    setGrant(base, user, grant) {
      const grantObj = {
        value: grant,
      };

      if (user.database.virgin) {
        grantObj.virgin = true;
      }

      this.privateDatabaseService
        .setUserGrant(
          this.productId,
          base.databaseName,
          user.userName,
          grantObj,
        )
        .then(() => {
          this.pendingGrant[user.userName] = true;
          this.privateDatabaseService.restartPoll(this.productId, [
            'grant/create',
            'grant/update',
          ]);
          this.alerter.success(
            this.$translate.instant('privateDatabase_tabs_users_grant_doing'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.alerter.alertFromSWS(
            this.$translate.instant('privateDatabase_tabs_users_grant_error'),
            err,
            this.$scope.alerts.main,
          );
        });
    }

    onUserGrantStart() {
      this.alerter.success(
        this.$translate.instant('privateDatabase_tabs_users_grant_doing'),
        this.$scope.alerts.main,
      );
    }

    onUserGrantError(event, task) {
      this.pendingGrant[task.userName] = false;
      this.alerter.error(
        this.$translate.instant('privateDatabase_tabs_users_grant_error'),
        this.$scope.alerts.main,
      );
    }

    onUserGrantDone(event, task) {
      this.pendingGrant[task.userName] = false;
      this.refresh();
      this.alerter.success(
        this.$translate.instant('privateDatabase_tabs_users_grant_success'),
        this.$scope.alerts.main,
      );
    }

    refresh() {
      this.getUsers();
    }
  },
);
