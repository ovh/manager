import component from './vps-secondary-dns.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.secondary-dns', {
    url: '/secondary-dns',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
    resolve: {
      goToAddSecondaryDns: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.secondary-dns.add'),
      goToDeleteSecondaryDns: /* @ngInject */ ($state) => (domain) =>
        $state.go('vps.detail.secondary-dns.delete', { domain }),
      goBackToSecondaryDns: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.secondary-dns'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_secondary_dns'),
    },
  });
};
