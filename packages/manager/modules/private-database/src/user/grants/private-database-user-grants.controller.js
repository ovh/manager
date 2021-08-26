import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import some from 'lodash/some';

export default class PrivateDatabaseUsersGrantsCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    PrivateDatabase,
    $scope,
    $stateParams,
    userName,
    $translate,
  ) {
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.userName = userName;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.grants = ['admin', 'rw', 'ro', 'none'];

    this.loaders = {
      userGrants: true,
      setGrant: false,
    };

    this.isDoingGrant = [];
    this.userGrantsDetails = [];

    this.$scope.$on(
      'privateDatabase.grant.set.start',
      this.onUserGrantStart.bind(this),
    );
    this.$scope.$on(
      'privateDatabase.grant.set.done',
      this.onUserGrantDone.bind(this),
    );
    this.$scope.$on(
      'privateDatabase.grant.set.error',
      this.onUserGrantError.bind(this),
    );

    forEach(['done', 'error'], (state) => {
      this.$scope.$on(
        `privateDatabase.global.actions.${state}`,
        (e, taskOpt) => {
          this.$scope.lockAction = taskOpt.lock
            ? false
            : this.$scope.lockAction;
        },
      );
    });

    this.$scope.$on('privateDatabase.global.actions.start', (e, taskOpt) => {
      this.$scope.lockAction = taskOpt.lock || this.$scope.lockAction;
    });

    this.$scope.$on('$destroy', () => {
      this.privateDatabaseService.killPollUserGrant();
    });

    this.restartPoll();

    this.getUserGrants();
  }

  getUserGrants() {
    this.loaders.userGrants = true;
    this.nbGrants = 0;
    this.userGrants = null;

    return this.privateDatabaseService
      .getUserGrants(this.productId, this.userName)
      .then((userGrants) => {
        this.userGrants = userGrants;
        this.nbGrants = keys(this.userGrants).length;
        return userGrants;
      })
      .catch((err) => {
        this.alerter.error(err.message, this.$scope.alerts.main);
      })
      .finally(() => {
        this.loaders.userGrants = false;
      });
  }

  setGrant(base, newGrant) {
    this.userGrants[base].newGrant = newGrant;

    this.loaders.setGrant = true;

    return this.privateDatabaseService
      .setUserGrant(
        this.productId,
        base,
        this.$scope.user.userName,
        this.userGrants[base],
      )
      .then(() => {
        this.alerter.success(
          this.$translate.instant('privateDatabase_tabs_users_grant_doing'),
          this.$scope.alerts.main,
        );
      })
      .catch(() => {
        this.alerter.error(
          this.$translate.instant('privateDatabase_tabs_users_grant_error'),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loaders.setGrant = false;
      });
  }

  restartPoll() {
    this.privateDatabaseService.restartPoll(this.productId, [
      'grant/create',
      'grant/update',
    ]);
  }

  onUserGrantStart(evt, opts) {
    this.isDoingGrant[opts.databaseName] = some(this.userGrants, {
      dataBase: opts.databaseName,
    });
  }

  onUserGrantDone(evt, opts) {
    this.isDoingGrant[opts.databaseName] = false;
    this.loaders.setGrant = false;
    this.userGrants[opts.databaseName].value =
      opts.grants[opts.databaseName].value;

    this.alerter.success(
      this.$translate.instant('privateDatabase_tabs_users_grant_success'),
      this.$scope.alerts.main,
    );

    this.getUserGrants();
  }

  onUserGrantError(evt, opts) {
    this.isDoingGrant[opts.databaseName] = false;
    this.alerter.error(
      this.$translate.instant('privateDatabase_tabs_users_grant_error'),
      this.$scope.alerts.main,
    );
  }
}
