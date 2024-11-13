export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.contact', {
    url: '/contact-management',
    views: {
      domainView: {
        component: 'domainZoneDashboardContact',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('contact_management'),
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone'),
    },
  });
};
