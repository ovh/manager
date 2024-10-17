import { US_API_CONSOLE_LINK } from '../constants';

export default class IpByoipDeleteController {
  /* @ngInject */
  constructor($scope, coreURLBuilder) {
    this.$scope = $scope;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.data = this.$scope.currentActionData;
    this.serviceLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/autorenew',
    );
    this.apiConsoleUrl = US_API_CONSOLE_LINK;
    this.cancelAction = () => {
      this.$scope.resetAction();
    };
  }
}
