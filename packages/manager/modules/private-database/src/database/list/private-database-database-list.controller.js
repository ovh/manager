import angular from 'angular';
import clone from 'lodash/clone';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';

export default class PrivateDatabaseBDDsListCtrl {
  /* @ngInject */
  constructor($q, $scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    const statusToWatch = ['start', 'done', 'error'];
    this.itemsPerPage = 10;
    this.bddsDetails = [];
    this.loaders = {
      bdd: false,
    };

    this.canImport = false;

    this.currentAddBdds = [];

    this.isPostgreSql = this.$scope.database.version.match(/postgresql/);

    forEach(statusToWatch, (state) => {
      this.$scope.$on(
        `privateDatabase.database.delete.${state}`,
        this[`onDataBaseDelete${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.database.create.${state}`,
        this[`onDataBaseCreate${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.database.dump.${state}`,
        this[`onDataBaseDump${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.database.restore.${state}`,
        this[`onDataBaseRestore${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.database.wizard.${state}`,
        this[`onDataBaseCreate${state}`].bind(this),
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

    this.privateDatabaseService.restartPoll(this.productId, [
      'database/delete',
      'database/create',
      'database/dump',
      'database/restore',
    ]);

    this.getBDDS();
  }

  getBDDS() {
    this.loaders.bdd = true;
    this.bddsIds = null;

    this.privateDatabaseService
      .getBDDSId(this.productId)
      .then((bdds) => {
        this.bddsIds = bdds;
      })
      .finally(() => {
        this.loaders.bdd = this.bddsIds.length > 0;
      });
  }

  getPromise(promise) {
    promise.then(
      () => {
        this.privateDatabaseService.restartPoll(this.productId, [
          'database/delete',
          'database/create',
        ]);
      },
      () => {
        this.privateDatabaseService.restartPoll(this.productId, [
          'database/delete',
          'database/create',
        ]);
      },
    );
  }

  transformItem(item) {
    let detailedItem;
    return this.privateDatabaseService
      .getBDD(this.productId, item)
      .then((originalDetailedItem) => {
        detailedItem = clone(originalDetailedItem);

        return this.privateDatabaseService.getDumpsBDD(this.productId, item);
      })
      .then((dumps) => {
        detailedItem.dumpsCount = dumps.length;
        return detailedItem;
      });
  }

  onTransformItemDone() {
    this.loaders.bdd = false;
  }

  dumpBDD(bdd) {
    this.privateDatabaseService
      .dumpBDD(this.productId, bdd.databaseName, true)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('privateDatabase_dump_bdd_in_progress'),
          this.$scope.alerts.main,
        );
      })
      .catch(() => {
        this.alerter.error(
          this.$translate.instant('privateDatabase_dump_bdd_fail'),
          this.$scope.alerts.main,
        );
      });
  }

  importFromFile(bdd) {
    this.$scope.setAction(
      'database/import/private-database-database-import',
      bdd.databaseName,
    );
  }

  importFromFilesIfPossible(bdd) {
    if (this.canImport && !this.isDisabled(bdd)) {
      this.importFromFile(bdd);
    }
  }

  isDisabled(bdd) {
    return (
      this.$scope.database.state !== 'started' ||
      this.$scope.taskState.changeVersion ||
      bdd.waitDump ||
      bdd.waitRestore
    );
  }

  findItemIndex(databaseName) {
    const deferred = this.$q.defer();

    let unregisterWatch = null;

    const todo = () => {
      const idx = findIndex(
        this.bddsDetails,
        (bdd) => bdd.databaseName === databaseName,
      );

      if (idx !== -1) {
        deferred.resolve(idx);

        if (unregisterWatch) {
          unregisterWatch();
        }
      }
    };

    if (!isEmpty(this.bddsDetails)) {
      todo();
    } else {
      unregisterWatch = this.$scope.$watch(
        angular.bind(this, () => this.bddsDetails.length),
        todo,
      );
    }

    return deferred.promise;
  }

  onDataBaseDeletestart(evt, opts) {
    this.findItemIndex(opts.databaseName).then((idx) => {
      if (idx !== -1) {
        this.bddsDetails[idx].waitDelete = true;
      }
    });
  }

  onDataBaseDeletedone() {
    this.getBDDS();
    this.alerter.success(
      this.$translate.instant('privateDatabase_delete_user_success'),
      this.$scope.alerts.main,
    );
  }

  onDataBaseDeleteerror(opts) {
    this.findItemIndex(opts.databaseName).then((idx) => {
      if (idx !== -1) {
        delete this.bddsDetails[idx].waitDelete;
        this.alerter.error(
          this.$translate.instant('privateDatabase_delete_bdd_fail'),
          this.$scope.alerts.main,
        );
      }
    });
  }

  onDataBaseCreatestart(evt, opts) {
    if (this.currentAddBdds.indexOf(opts.databaseName) === -1) {
      this.currentAddBdds.push(opts.databaseName);
    }
  }

  onDataBaseCreatedone(evt, opts) {
    this.getBDDS();

    remove(this.currentAddBdds, (name) => opts.databaseName === name);

    this.alerter.success(
      this.$translate.instant('privateDatabase_add_bdd_success'),
      this.$scope.alerts.main,
    );
  }

  onDataBaseCreateerror(opts) {
    this.currentAddBdds = remove(this.currentAddBdds, opts.databaseName);
    this.alerter.error(
      this.$translate.instant('privateDatabase_add_bdd_fail'),
      this.$scope.alerts.main,
    );
  }

  onDataBaseDumpstart(evt, opts) {
    this.findItemIndex(opts.databaseName).then((idx) => {
      this.bddsDetails[idx].waitDump = true;
    });
  }

  onDataBaseDumpdone() {
    this.getBDDS();
    this.alerter.success(
      this.$translate.instant('privateDatabase_dump_bdd_success'),
      this.$scope.alerts.main,
    );
  }

  onDataBaseDumperror(opts) {
    this.findItemIndex(opts.databaseName).then((idx) => {
      delete this.bddsDetails[idx].waitDump;
      this.alerter.error(
        this.$translate.instant('privateDatabase_dump_bdd_fail'),
        this.$scope.alerts.main,
      );
    });
  }

  onDataBaseRestorestart(evt, opts) {
    this.findItemIndex(opts.databaseName).then((idx) => {
      this.bddsDetails[idx].waitRestore = true;
    });
  }

  onDataBaseRestoredone() {
    this.getBDDS();
    this.alerter.success(
      this.$translate.instant('privateDatabase_tabs_dumps_restore_success'),
      this.$scope.alerts.main,
    );
  }

  onDataBaseRestoreerror(opts) {
    this.findItemIndex(opts.databaseName).then((idx) => {
      delete this.bddsDetails[idx].waitRestore;
      this.alerter.error(
        this.$translate.instant('privateDatabase_tabs_dumps_restore_fail'),
        this.$scope.alerts.main,
      );
    });
  }
}
