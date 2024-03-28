import { DIAGNOSTIC_STATE } from '../hosting-multisite.constants';

export default class MultisiteDiagnosticCtrl {
  /* @ngInject */
  constructor($scope, coreURLBuilder) {
    this.scope = $scope;
    this.coreURLBuilder = coreURLBuilder;

    const { options } = $scope.currentActionData;
    this.ip = options.ip;
    this.domain = options.domain;
    this.dns = options.dns;
    this.nic = options.nic;
    this.isDnsExternal = options.isDnsExternal;
    this.diagnosticState = options.diagnosticState;
    this.isDnsAttachedToNic = options.isDnsAttachedToNic;

    const { zone } = options;
    this.linkToARecordModification = this.coreURLBuilder.buildURL(
      'web',
      '#/domain/:zone/zone',
      {
        zone,
      },
    );

    this.DIAGNOSTIC_STATE = DIAGNOSTIC_STATE;
  }

  resetAction() {
    this.scope.resetAction();
  }
}
