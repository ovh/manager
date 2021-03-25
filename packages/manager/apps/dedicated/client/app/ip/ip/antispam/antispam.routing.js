import template from './ip-ip-antispam.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.ip.antispam', {
    url: '/antispam',
    template,
    controller: 'IpAntispamCtrl',
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_antispam'),
    },
  });
};
