export default class PrivateDatabaseUsersCtrl {
  /* @ngInject */
  constructor($scope, goToGrants, goToUsers) {
    this.$scope = $scope;
    this.goToGrants = goToGrants;
    this.goToUsers = goToUsers;
  }

  $onInit() {
    this.$scope.user = null;

    this.$scope.goToGrants = (user) => {
      this.$scope.user = user;
      this.goToGrants(user);
    };

    this.$scope.goToList = () => {
      this.$scope.user = null;
      this.goToUsers();
    };
  }
}
