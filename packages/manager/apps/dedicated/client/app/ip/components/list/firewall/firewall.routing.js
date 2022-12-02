import controller from './ip-ip-firewall.controller';
import template from './ip-ip-firewall.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.ip.firewall', {
    url: '/firewall',
    views: {
      'ipview@app.ip': {
        template,
        controller,
        controllerAs: 'IpFirewallCtrl',
      },
    },
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_firewall'),
    },
  });
};
