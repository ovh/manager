import clone from 'lodash/clone';
import forEach from 'lodash/forEach';

export default class PrivateDatabaseBDDsDumpsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    $window,
    Alerter,
    PrivateDatabase,
    databaseName,
    serviceName,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.$window = $window;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.databaseName = databaseName;
    this.serviceName = serviceName;
  }

  $onInit() {
    this.productId = this.serviceName;

    this.statusToWatch = ['start', 'done', 'error'];
    this.dumpIdRestoring = null;

    forEach(this.statusToWatch, (state) => {
      this.$scope.$on(
        `privateDatabase.database.dump.${state}`,
        this[`onDataBaseDump${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.database.dump.delete.${state}`,
        this[`onDataBaseDumpDelete${state}`].bind(this),
      );
      this.$scope.$on(
        `privateDatabase.database.restore.${state}`,
        this[`onDataBaseRestore${state}`].bind(this),
      );
    });

    this.privateDatabaseService.restartPoll(this.productId, [
      'database/dump',
      'database/restore',
    ]);

    return this.getDatabase().then(() => this.getDumps());
  }

  $onDestroy() {
    this.privateDatabaseService.killPollRestore();
  }

  getDatabase() {
    return this.privateDatabaseService
      .getBDD(this.productId, this.databaseName)
      .then((database) => {
        this.database = database;
      });
  }

  getDumps() {
    this.dumps = null;

    this.privateDatabaseService
      .getDumpsBDD(this.productId, this.database.databaseName)
      .then((dumpsIds) => {
        this.dumps = dumpsIds.map((id) => ({ id }));
      })
      .catch(() => {
        this.alerter.error(
          this.$translate.instant(
            'privateDatabase_tabs_dumps_fail_retrieve_dumps',
          ),
          this.$scope.alerts.main,
        );
      });
  }

  goTo(page, target) {
    this.$window.open(page, target);
  }

  transformItem(item) {
    if (item.transformed) {
      return this.$q((resolve) => resolve(item));
    }
    return this.privateDatabaseService
      .getDumpBDD(this.productId, this.database.databaseName, item.id)
      .then((originalDump) => {
        const dump = clone(originalDump);
        dump.id = item.id;
        dump.transformed = true;
        dump.waitRestore =
          this.database.waitRestore && dump.id === this.dumpIdRestoring;

        return dump;
      });
  }

  onDataBaseDumpstart(opts) {
    if (this.database.databaseName === opts.databaseName) {
      this.database.waitDump = true;
    }
  }

  onDataBaseDumpdone(opts) {
    if (this.database.databaseName === opts.databaseName) {
      delete this.database.waitDump;
      this.getDumps();
      this.alerter.success(
        this.$translate.instant('privateDatabase_dump_bdd_success'),
        this.$scope.alerts.main,
      );
    }
  }

  onDataBaseDumperror(opts) {
    if (this.database.databaseName === opts.databaseName) {
      delete this.database.waitDump;
      this.alerter.error(
        this.$translate.instant('privateDatabase_dump_bdd_fail'),
        this.$scope.alerts.main,
      );
    }
  }

  onDataBaseDumpDeletestart(evt, opts) {
    if (this.database.databaseName === opts.databaseName) {
      this.alerter.success(
        this.$translate.instant('privateDatabase_tabs_dumps_delete_start'),
        this.$scope.alerts.main,
      );
    }
  }

  onDataBaseDumpDeletedone(evt, opts) {
    if (this.database.databaseName === opts.databaseName) {
      this.getDumps();
      this.alerter.success(
        this.$translate.instant('privateDatabase_tabs_dumps_delete_done'),
        this.$scope.alerts.main,
      );
    }
  }

  onDataBaseDumpDeleteerror(evt, opts) {
    if (this.database.databaseName === opts.databaseName) {
      this.alerter.error(
        this.$translate.instant('privateDatabase_tabs_dumps_delete_error'),
        this.$scope.alerts.main,
      );
    }
  }

  onDataBaseRestorestart(evt, opts) {
    this.database.waitRestore = true;
    this.dumpIdRestoring = opts.dumpId;

    this.dumps
      .filter((dump) => dump.id === opts.id)
      .forEach((dump) => {
        // eslint-disable-next-line no-param-reassign
        dump.waitRestore = true;
      });
  }

  onDataBaseRestoredone() {
    delete this.database.waitRestore;
    this.dumpIdRestoring = null;

    this.dumps.forEach((dump) => {
      // eslint-disable-next-line no-param-reassign
      delete dump.waitRestore;
    });
    this.alerter.success(
      this.$translate.instant('privateDatabase_tabs_dumps_restore_success'),
      this.$scope.alerts.main,
    );
  }

  onDataBaseRestoreerror(opts) {
    delete this.database.waitRestore;
    this.dumpIdRestoring = null;

    this.dumps
      .filter((dump) => dump.id === opts.id)
      .forEach((dump) => {
        // eslint-disable-next-line no-param-reassign
        delete dump.waitRestore;
        this.alerter.error(
          this.$translate.instant('privateDatabase_tabs_dumps_restore_fail'),
          this.$scope.alerts.main,
        );
      });
  }
}
