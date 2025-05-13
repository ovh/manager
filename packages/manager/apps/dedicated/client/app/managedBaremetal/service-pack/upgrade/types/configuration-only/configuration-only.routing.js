import stepModuleNames from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/configuration-only/configuration-only.steps';

import component from '../../../../../components/dedicated-cloud/service-pack/upgrade/upgrade.component';

export const state = {
  name: 'app.managedBaremetal.details.servicePackUpgrade.configurationOnly',
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
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('managed_baremetal_servicepack_upgrade_configuration'),
  },
  url: '/configurationOnly',
  views: {
    'pccView@app.managedBaremetal.details': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
