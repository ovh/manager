import stepModuleNames from './configuration-only.steps';

import component from '../../upgrade.component';

export const state = {
  name: 'app.dedicatedClouds.servicePackUpgrade.configurationOnly',
  params: {
    activationType: 'basic',
  },
  resolve: {
    backButtonText: /* @ngInject */ $translate => $translate
      .instant('ovhManagerPccServicePackUpgradeConfigurationOnly_header'),
    steps: /* @ngInject */ pccServicePackUpgradeService => pccServicePackUpgradeService
      .buildSteps(stepModuleNames),
  },
  translations: {
    format: 'json',
    value: ['.'],
  },
  url: '/configurationOnly',
  views: {
    'pccView@app.dedicatedClouds': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
