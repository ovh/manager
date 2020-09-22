angular.module('App').controller(
  'PrivateDatabaseBDDsCtrl',
  class PrivateDatabaseBDDsCtrl {
    constructor(
      $scope,
      goToArchives,
      goToArchivesDump,
      goToDatabases,
      goToDumps,
      goToExtensions,
      goToUsers,
    ) {
      this.$scope = $scope;
      this.goToArchives = goToArchives;
      this.goToArchivesDump = goToArchivesDump;
      this.goToDatabases = goToDatabases;
      this.goToDumps = goToDumps;
      this.goToExtensions = goToExtensions;
      this.goToUsers = goToUsers;
    }

    $onInit() {
      this.$scope.goToDumps = (bdd) => {
        this.$scope.bdd = bdd;
        this.goToDumps();
      };

      this.$scope.goToExtension = (bdd) => {
        this.$scope.bdd = bdd;
        this.goToExtensions();
      };

      this.$scope.goToArchivesList = () => {
        this.$scope.bdd = null;
        this.goToArchives();
      };

      this.$scope.goToArchivesDumps = (bdd) => {
        this.$scope.bdd = bdd;
        this.goToArchivesDump();
      };

      this.$scope.goToUsersByDb = (bdd) => {
        this.$scope.bdd = bdd;
        this.goToUsers(bdd);
      };

      this.$scope.goToList = () => {
        this.$scope.bdd = null;
        this.goToDatabases();
      };
    }
  },
);
