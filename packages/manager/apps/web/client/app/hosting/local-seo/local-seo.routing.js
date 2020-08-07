import template from './LOCAL_SEO.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.local-seo', {
    url: '/localSeo',
    controller: 'HostingTabLocalSeoCtrl',
    template,
  });
};
