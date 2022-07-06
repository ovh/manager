import { UPGRADE_MODE } from './upgrade.constants';
import { UPGRADE_TYPE } from '../dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.upgrade', {
    url: '/upgrade/:upgradeType',
    views: {
      'dashboard@app.dedicated-server.server.dashboard': {
        component: 'dedicatedServerUpgrade',
      },
    },
    resolve: {
      breadcrumb: () => null,
      getRenewDetails: () => (option) =>
        option.prices.find((price) => price.capacities?.includes('renew')),
      getOptionPrice: /* @ngInject */ (getRenewDetails) => (option) =>
        getRenewDetails(option)?.price,
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      upgradeOptions: /* @ngInject */ (
        getOptionPrice,
        technicalDetails,
        upgradeType,
      ) =>
        [
          ...(upgradeType === UPGRADE_TYPE.RAM
            ? technicalDetails.memory?.upgradable
            : technicalDetails.storage?.upgradable),
        ].sort(
          (option1, option2) =>
            getOptionPrice(option1)?.value - getOptionPrice(option2)?.value,
        ),
      optionId: /* @ngInject */ (technicalDetails, upgradeType) =>
        upgradeType === UPGRADE_TYPE.RAM
          ? technicalDetails.memory?.serviceId
          : technicalDetails.storage?.serviceId,
      upgradeMode: /* @ngInject */ (upgradeTask) => {
        let upgradeMode = UPGRADE_MODE.ORDER;
        if (upgradeTask) {
          upgradeMode = upgradeTask.needSchedule
            ? UPGRADE_MODE.SCHEDULE
            : UPGRADE_MODE.NONE;
        }
        return upgradeMode;
      },
      upgradeType: /* @ngInject */ ($transition$) =>
        $transition$.params().upgradeType,
    },
  });
};
