angular.module('App').controller(
  'PrivateDatabaseArchiveListCtrl',
  class PrivateDatabaseArchiveListCtrl {
    constructor($scope, $stateParams, $q, $window, Alerter, PrivateDatabase) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$q = $q;
      this.$window = $window;
      this.alerter = Alerter;
      this.privateDatabase = PrivateDatabase;
      this.$scope.nbDayToDelete = this.privateDatabase.NBDAYTODELETE;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;
      this.$scope.goTo = (page, target) => {
        this.$window.open(page, target);
      };

      this.getDumps();
    }

    getDump(dumpId) {
      return this.privateDatabase
        .getDump(this.productId, dumpId)
        .catch(err => this.alerter.error(err));
    }

    getDumps() {
      const deletedDbs = {};
      this.deletedDbList = null;
      return this.privateDatabase
        .getDumps(this.productId, true)
        .then(dumpsId => this.$q.all(_.map(dumpsId, dumpId => this.getDump(dumpId))))
        .then((dumps) => {
          dumps.forEach((dump) => {
            let deletedDb = deletedDbs[dump.databaseName];
            if (!deletedDb) {
              deletedDb = { databaseName: dump.databaseName, dumps: [] };
              deletedDbs[dump.databaseName] = deletedDb;
            }
            deletedDb.dumps.push(dump);
          });
          this.deletedDbList = _.values(deletedDbs)
            .sort((a, b) => a.databaseName.localeCompare(b.databaseName));
        })
        .catch(err => this.alerter.error(err));
    }
  },
);
