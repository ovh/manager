import component from '../../../../../components/dedicated-cloud/service-pack/upgrade/upgrade.component';
import stepModuleNames from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/basicOptions/basicOptions.steps';

export const state = {
  url: '/basicOptions',
  name: 'app.managedBaremetal.details.servicePackUpgrade.basicOptions',
  params: {
    activationType: 'basic',
  },
  resolve: {
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
      $translate.instant('managed_baremetal_servicepack_upgrade_basicoptions'),
  },
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
