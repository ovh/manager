import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import { FIREWALL_STATES } from './firewall-toggle.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.firewall-toggle', {
    url: '/firewall-toggle?ip&ipBlock',
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
      ip: /* @ngInject */ ($transition$, ipBlock, IpFirewall) => {
        const { ip } = $transition$.params();

        const foundIp = find(ipBlock.ips, { ip });

        return IpFirewall.getFirewallDetails(ipBlock.ipBlock, ip)
          .then((result) => ({
            ...foundIp,
            firewall: result.enabled
              ? FIREWALL_STATES.ACTIVATED
              : FIREWALL_STATES.DEACTIVATED,
          }))
          .catch(() => ({
            ...foundIp,
            firewall: FIREWALL_STATES.NOT_CONFIGURED,
          }));
      },
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
        component: 'ipDashboardFirewallToggle',
      },
    },
    layout: 'modal',
  });
};
