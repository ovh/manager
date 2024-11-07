export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.tags.unassign', {
    url: '/unassign',
    views: {
      modal: {
        component: 'serverUnassignTags',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
