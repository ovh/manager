import component from '../../../../../components/dedicated-cloud/service-pack/upgrade/upgrade.component';
import stepModuleNames from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/basicOptions/basicOptions.steps';

export const state = {
  name: 'app.dedicatedCloud.details.servicePackUpgrade.basicOptions',
  params: {
    activationType: 'basic',
    isPremier: null,
  },
  resolve: {
    isPremier: /* @ngInject */ ($transition$) =>
      $transition$.params().isPremier,
    backButtonText: /* @ngInject */ ($translate) =>
      $translate.instant('ovhManagerPccServicePackUpgradeBasicOptions_header'),
    orderableServicePacks: /* @ngInject */ (
      currentService,
      currentUser,
      UpgradeBasicOptionsService,
    ) =>
      UpgradeBasicOptionsService.getOrderableServicePacks(
        currentService.name,
        currentUser.ovhSubsidiary,
      ),
    steps: /* @ngInject */ (pccServicePackUpgradeService) =>
      pccServicePackUpgradeService.buildSteps(stepModuleNames),
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('dedicated_cloud_servicepack_upgrade_basicoptions'),
  },
  url: '/basicOptions',
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
