import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.virtual-mac', {
    url: '/virtual-mac?ip&ipBlock&serviceType',
    params: {
      ip: {
        type: 'string',
      },
      ipBlock: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
      serviceType: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ip, ipBlock, serviceName]) =>
        isEmpty(ip) || isEmpty(ipBlock) || isEmpty(serviceName)
          ? 'app.ip.dashboard'
          : null,
      );
    },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      ip: /* @ngInject */ ($transition$, ipBlock) => {
        const { ip } = $transition$.params();

        return find(ipBlock.ips, { ip });
      },
      ipBlock: /* @ngInject */ (
        $q,
        $transition$,
        Ip,
        IpDashboardVirtualMac,
        serviceName,
        serviceType,
      ) => {
        const { ipBlock } = $transition$.params();

        return $q
          .all({
            ips: Ip.getIpsListForService(serviceName),
            virtualMacs: IpDashboardVirtualMac.getVirtualMacList({
              category: serviceType,
              serviceName,
            }),
          })
          .then(({ ips, virtualMacs }) => {
            const block = find(ips, { ipBlock });

            block.service = {
              virtualMac: {
                virtualMacs,
              },
            };

            return block;
          });
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
    },
    views: {
      modal: {
        component: 'ipDashboardVirtualMac',
      },
    },
    layout: 'modal',
  });
};
