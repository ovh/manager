import { UPGRADE_MODE, DEFAULT_INTERVAL } from './upgrade.constants';
import { UPGRADE_TYPE } from '../dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.dashboard.upgrade', {
    url: '/upgrade/:upgradeType',
    views: {
      'dashboard@app.dedicated-cluster.cluster.node.dashboard': {
        component: 'serverUpgrade',
      },
    },
    resolve: {
      breadcrumb: () => null,
      getRenewDetails: () => (option) =>
        option.prices.find((price) => price.capacities?.includes('renew')),
      getOptionPrice: /* @ngInject */ (getRenewDetails) => (option) =>
        getRenewDetails(option)?.price,
      getOptionInterval: /* @ngInject */ (getRenewDetails) => (option) =>
        getRenewDetails(option)?.interval,
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
      renewPeriod: /* @ngInject */ (upgradeOptions, getOptionInterval) => {
        const intervals = upgradeOptions.find(
          (option) => getOptionInterval(option) !== DEFAULT_INTERVAL,
        );
        return intervals ? getOptionInterval(intervals) : DEFAULT_INTERVAL;
      },
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
