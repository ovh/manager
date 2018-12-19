import _ from 'lodash';

export default class PrivateDatabaseCertificateCtrl {
  /* @ngInject */

  constructor($scope, $stateParams, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
  }

  $onInit() {
    this.productId = this.$stateParams.serviceName;
    this.database = this.$scope.currentActionData;

    this.model = {
      certificate: _.get(this.database, 'tlsCa', null),
    };
  }
}
