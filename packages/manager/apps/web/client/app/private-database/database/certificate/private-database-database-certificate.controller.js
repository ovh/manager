angular.module('App').controller(
  'PrivateDatabaseCertificateCtrl',
  class PrivateDatabaseCertificateCtrl {
    constructor($scope, $stateParams, Alerter, PrivateDatabase) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.alerter = Alerter;
      this.privateDatabaseService = PrivateDatabase;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;
      this.database = this.$scope.currentActionData;

      this.model = {
        certificate: _.get(this.database, 'tlsCa', null),
      };
    }
  },
);
