import template from './LOCAL_SEO.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.local-seo', {
    url: '/localSeo',
    controller: 'HostingTabLocalSeoCtrl',
    controllerAs: '$ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_local_seo'),
    },
  });
};
