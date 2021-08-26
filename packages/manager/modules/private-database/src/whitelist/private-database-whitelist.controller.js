import angular from 'angular';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

export default class PrivateDatabaseWhitelistListCtrl {
  /* @ngInject */
  constructor(
    Alerter,
    PrivateDatabase,
    $scope,
    $stateParams,
    $translate,
    PrivateDatabaseWhitelistService,
  ) {
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.whitelistService = PrivateDatabaseWhitelistService;
  }

  $onInit() {
    const statusToWatch = ['start', 'done', 'error'];
    this.serviceName = this.$stateParams.productId;

    this.getList();

    this.privateDatabaseService.restartPoll(this.serviceName, [
      'whitelist/delete',
      'whitelist/create',
    ]);

    forEach(statusToWatch, (state) => {
      this.$scope.$on(
        `privateDatabase.whitelist.create.${state}`,
        this[`onWhitelistCreate${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.whitelist.delete.${state}`,
        this[`onWhitelistDelete${state}`].bind(this),
      );
    });
    this.$scope.$on('privateDatabase.whitelist.update.done', (opts) =>
      opts.serviceName === this.serviceName ? this.getList() : undefined,
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
  }

  getList() {
    this.whitelistIps = null;

    return this.whitelistService
      .getWhitelistIds(this.serviceName)
      .then((res) => {
        this.whitelistIps = res.map((id) => ({ id }));
        return this.whitelistIps;
      })
      .catch((err) => this.alerter.error(err));
  }

  createWhitelist() {
    this.$scope.setAction('whitelist/add/private-database-whitelist-add');
  }

  editWhitelist(whitelist) {
    this.$scope.setAction(
      'whitelist/update/private-database-whitelist-update',
      whitelist,
    );
  }

  deleteWhitelist(whitelist) {
    this.$scope.setAction(
      'whitelist/delete/private-database-whitelist-delete',
      whitelist,
    );
  }

  transformItem(whitelist) {
    return this.whitelistService
      .getWhitelist(this.serviceName, whitelist.id)
      .catch((err) => this.alerter.error(err));
  }

  /*
            POLLING
        */
  onWhitelistCreatestart(evt, opts) {
    this.whitelistIps.push({
      ip: opts.whitelistIp,
      creating: true,
      name: '',
    });
  }

  onWhitelistCreatedone() {
    this.getList();
  }

  onWhitelistCreateerror() {
    this.alerter.error(
      this.$translate.instant('privateDatabase_modale_whitelist_add_fail'),
      this.$scope.alerts.main,
    );
    this.getList();
  }

  onWhitelistDeletestart(evt, opts) {
    let unregister = null;

    const todo = () => {
      const el = find(
        this.whitelistIps,
        (whitelist) => whitelist.ip === opts.whitelistIp,
      );

      if (el) {
        el.deleting = true;

        if (unregister) {
          unregister();
        }
      }
    };

    if (this.whitelistIps && this.whitelistIps.length) {
      todo();
    } else {
      unregister = this.$scope.$watch(
        angular.bind(this, () => this.whitelistIps && this.whitelistIps.length),
        todo,
      );
    }
  }

  onWhitelistDeletedone() {
    this.getList();
  }

  onWhitelistDeleteerror(evt, opts) {
    let unregister = null;

    const todo = () => {
      const el = find(
        this.whitelistIps,
        (whitelist) => whitelist.ip === opts.whitelistIp,
      );

      if (el) {
        delete el.deleting;

        this.alerter.error(
          this.$translate.instant(
            'privateDatabase_modale_whitelist_delete_fail',
          ),
          this.$scope.alerts.main,
        );

        if (unregister) {
          unregister();
        }
      }
    };

    if (this.whitelistIps && this.whitelistIps.length) {
      todo();
    } else {
      unregister = this.$scope.$watch(
        angular.bind(this, () => this.whitelistIps && this.whitelistIps.length),
        todo,
      );
    }
  }
}
