angular.module('App').controller(
  'PrivateDatabaseBDDsCtrl',
  class PrivateDatabaseBDDsCtrl {
    constructor($scope) {
      this.$scope = $scope;
    }

    $onInit() {
      this.$scope.goToDumps = (bdd) => {
        this.$scope.bdd = bdd;
        this.$scope.bddView = 'private-database/database/dump/private-database-database-dump.html';
      };

      this.$scope.goToExtension = (bdd) => {
        this.$scope.bdd = bdd;
        this.$scope.bddView = 'private-database/database/extension/private-database-database-extension.html';
      };

      this.$scope.goToArchivesList = () => {
        this.$scope.bdd = null;
        this.$scope.bddView = 'private-database/database/archive/list/private-database-database-archive-list.html';
      };

      this.$scope.goToArchivesDumps = (bdd) => {
        this.$scope.bdd = bdd;
        this.$scope.bddView = 'private-database/database/archive/dump/private-database-database-archive-dump.html';
      };

      this.$scope.goToUsersByDb = (bdd) => {
        this.$scope.bdd = bdd;
        this.$scope.bddView = 'private-database/database/user/private-database-database-user.html';
      };

      this.$scope.goToList = () => {
        this.$scope.bdd = null;
        this.$scope.bddView = 'private-database/database/list/private-database-database-list.html';
      };

      this.$scope.goToList();
    }
  },
);
