import _ from 'lodash';

export const name = 'pccServicePackUpgradeService';

export const UpgradeService = class {
  /* @ngInject */
  constructor(
    $injector,
    $translate,
  ) {
    this.$injector = $injector;
    this.$translate = $translate;
  }

  buildSteps(stepModuleNames) {
    return _.map(
      stepModuleNames,
      moduleName => this.$injector.get(`${moduleName}Factory`),
    );
  }
};

export default {
  name,
  UpgradeService,
};
