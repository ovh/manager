import template from './ip-ip-firewall.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.ip.firewall', {
    url: '/firewall',
    template,
    controller: 'IpFirewallCtrl',
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_firewall'),
    },
  });
};
