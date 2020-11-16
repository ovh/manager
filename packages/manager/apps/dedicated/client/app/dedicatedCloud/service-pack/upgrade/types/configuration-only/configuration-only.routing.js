import stepModuleNames from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/configuration-only/configuration-only.steps';

import component from '../../../../../components/dedicated-cloud/service-pack/upgrade/upgrade.component';

export const state = {
  name: 'app.dedicatedCloud.details.servicePackUpgrade.configurationOnly',
  params: {
    activationType: 'basic',
  },
  resolve: {
    backButtonText: /* @ngInject */ ($translate) =>
      $translate.instant(
        'ovhManagerPccServicePackUpgradeConfigurationOnly_header',
      ),
    steps: /* @ngInject */ (pccServicePackUpgradeService) =>
      pccServicePackUpgradeService.buildSteps(stepModuleNames),
  },
  url: '/configurationOnly',
  views: {
    'pccView@app.dedicatedCloud.details': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
