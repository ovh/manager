import angular from 'angular';
import clone from 'lodash/clone';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';

export default class PrivateDatabaseUsersListCtrl {
  /* @ngInject */
  constructor(Alerter, PrivateDatabase, $scope, $stateParams, $translate) {
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;
    this.statusToWatch = ['start', 'done', 'error'];

    this.$scope.itemsPerPage = 10;

    this.currentUsers = {
      add: [],
    };
    this.currentDellUser = null;

    this.loaders = {
      users: false,
    };

    this.userDetails = [];

    this.getUsers();

    /*
     * Listners
     */
    forEach(this.statusToWatch, (state) => {
      this.$scope.$on(
        `privateDatabase.user.create.${state}`,
        this[`onUserCreate${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.user.delete.${state}`,
        this[`onUserDelete${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.user.changePassword.${state}`,
        this[`onUserChangePassword${state}`].bind(this),
      );
    });

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
      this.privateDatabaseService.killPollUserDelete();
      this.privateDatabaseService.killPollUserCreate();
    });
  }

  getUsers() {
    this.loaders.users = true;
    this.usersIds = null;

    return this.privateDatabaseService
      .getUsers(this.productId)
      .then((users) => {
        this.usersIds = users.sort((a, b) => a.localeCompare(b));
        this.users = this.usersIds.map((id) => ({ id }));
      })
      .catch((err) => {
        this.alerter.error(get(err, 'message', err), this.$scope.alerts.main);
      })
      .finally(() => {
        if (isEmpty(this.usersIds)) {
          this.loaders.users = false;
        }
      });
  }

  transformItem(item) {
    return this.privateDatabaseService
      .getUser(this.productId, item.id)
      .then((originalUser) => {
        const user = clone(originalUser);
        user.id = item.id;

        return user;
      });
  }

  getUserDetails(id) {
    return this.privateDatabaseService.getUser(this.productId, id);
  }

  getPromise(promise) {
    promise.finally(() => {
      this.privateDatabaseService.restartPoll(this.productId, [
        'user/create',
        'user/delete',
        'user/changePassword',
      ]);
    });
  }

  onTransformItemDone() {
    this.loaders.users = false;
  }

  /*
   * Create WucUser jobs
   */
  onUserCreatestart(evt, opts) {
    this.currentUsers.add.push(opts.userName);
  }

  onUserCreatedone(evt, opts) {
    this.currentUsers.add = remove(
      this.currentUsers.add,
      (userName) => userName !== opts.userName,
    );
    this.getUsers();
  }

  onUserCreateerror(evt, opts) {
    this.currentUsers.add = remove(
      this.currentUsers.add,
      (userName) => userName !== opts.userName,
    );
    this.alerter.error(
      this.$translate.instant('privateDatabase_add_user_fail'),
      this.$scope.alerts.main,
    );
  }

  /** EndCreateUserJobs */

  /*
   * delete WucUser jobs
   */
  onUserDeletestart(evt, opts) {
    let unregister = null;
    const todo = () => {
      const idx = findIndex(
        this.userDetails,
        (usr) => usr.userName === opts.userName,
      );

      if (idx !== -1) {
        this.userDetails[idx].waitDelete = true;

        if (unregister) {
          unregister();
        }
      }
    };

    if (this.userDetails && this.userDetails.length) {
      todo();
    } else {
      unregister = this.$scope.$watch(
        angular.bind(this, () => this.userDetails.length),
        todo,
      );
    }
  }

  onUserDeletedone() {
    this.getUsers();
  }

  onUserDeleteerror(evt, opts) {
    let unregister = null;
    const todo = () => {
      const idx = findIndex(
        this.userDetails,
        (usr) => usr.userName === opts.userName,
      );

      if (idx !== -1) {
        delete this.userDetails[idx].waiteDelete;

        this.alerter.error(
          this.$translate.instant('privateDatabase_delete_user_fail'),
          this.$scope.alerts.main,
        );

        if (unregister) {
          unregister();
        }
      }
    };

    if (!isEmpty(this.userDetails)) {
      todo();
    } else {
      unregister = this.$scope.$watch(
        angular.bind(this, () => this.userDetails.length),
        todo,
      );
    }
  }

  /** End deleteUserJobs */

  onUserChangePasswordstart(evt, opts) {
    let unregister = null;
    const todo = () => {
      const idx = findIndex(
        this.userDetails,
        (usr) => usr.userName === opts.userName,
      );

      if (idx !== -1) {
        this.userDetails[idx].waitChangePassword = true;

        if (unregister) {
          unregister();
        }
      }
    };

    if (this.userDetails && this.userDetails.length) {
      todo();
    } else {
      unregister = this.$scope.$watch(
        angular.bind(this, () => this.userDetails.length),
        todo,
      );
    }
  }

  onUserChangePassworddone(evt, opts) {
    let unregister = null;
    const todo = () => {
      const idx = findIndex(
        this.userDetails,
        (usr) => usr.userName === opts.userName,
      );

      if (idx !== -1) {
        delete this.userDetails[idx].waitChangePassword;

        this.alerter.success(
          this.$translate.instant('privateDatabase_change_userPassword_done'),
          this.$scope.alerts.main,
        );

        if (unregister) {
          unregister();
        }
      }
    };

    if (this.userDetails && this.userDetails.length) {
      todo();
    } else {
      unregister = this.$scope.$watch('userDetails.length', todo);
    }
  }

  onUserChangePassworderror(evt, opts) {
    let unregister = null;
    const todo = () => {
      const idx = findIndex(
        this.userDetails,
        (usr) => usr.userName === opts.userName,
      );

      if (idx !== -1) {
        delete this.userDetails[idx].waitChangePassword;

        this.alerter.error(
          this.$translate.instant('privateDatabase_change_userPassword_fail'),
          this.$scope.alerts.main,
        );

        if (unregister) {
          unregister();
        }
      }
    };

    if (this.userDetails && this.userDetails.length) {
      todo();
    } else {
      unregister = this.$scope.$watch(
        angular.bind(this, () => this.userDetails.length),
        todo,
      );
    }
  }

  restardPoll() {
    this.privateDatabaseService.restartPoll(this.productId, [
      'user/create',
      'user/delete',
      'user/changePassword',
    ]);
  }
}
