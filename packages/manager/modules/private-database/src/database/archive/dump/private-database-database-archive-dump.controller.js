export default class PrivateDatabaseArchiveDumpCtrl {
  /* @ngInject */
  constructor($scope, $q, $window, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$q = $q;
    this.$window = $window;
    this.alerter = Alerter;
    this.privateDatabase = PrivateDatabase;
  }

  $onInit() {
    this.$scope.goTo = (page, target) => {
      this.$window.open(page, target);
    };
    if (!this.$scope.bdd.name && this.$scope.bdd.dumps.length > 0) {
      this.$scope.bdd.name = this.$scope.bdd.dumps[0].databaseName;
    }
  }

  restaureDumpRequest(dump) {
    this.$scope.setAction(
      'database/restore-archive/private-database-database-restore-archive',
      { bdd: dump.databaseName, dump, func: this.$scope },
    );
  }
}
