export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.hosting.dashboard.multisite.git-view-last-deployment',
    {
      url: '/git-view-last-deployment?path',
      params: {
        path: null,
      },
      layout: 'modal',
      views: {
        modal: {
          component: 'hostingMultisiteGitViewLastDeploymentComponent',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('hosting_multisite'),
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().productId,
        path: /* @ngInject */ ($transition$) => $transition$.params().path,
        websiteId: /* @ngInject */ (HostingDomain, path, serviceName) =>
          HostingDomain.getWebsitesAssociated(serviceName, path).then(
            ([websiteId]) => websiteId,
          ),
      },
    },
  );
};
