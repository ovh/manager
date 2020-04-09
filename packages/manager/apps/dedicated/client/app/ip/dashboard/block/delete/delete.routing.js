import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.block.delete', {
    url: '/delete?ipBlock',
    params: {
      ipBlock: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ipBlock, serviceName]) =>
        isEmpty(ipBlock) || isEmpty(serviceName) ? 'app.ip.dashboard' : null,
      );
    },
    resolve: {
      ipBlock: /* @ngInject */ ($transition$, Ip, serviceName) => {
        const { ipBlock } = $transition$.params();

        return Ip.getIpsListForService(serviceName).then((ips) => {
          return find(ips, { ipBlock });
        });
      },
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
    views: {
      modal: {
        component: 'ipDashboardBlockDelete',
      },
    },
    layout: 'modal',
  });
};
