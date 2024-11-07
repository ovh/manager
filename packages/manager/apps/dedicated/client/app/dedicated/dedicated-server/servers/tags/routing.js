export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.tags', {
    url: '/tags',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerTags',
      },
    },
    resolve: {
      goToAssignTags: /* @ngInject */ ($state, server) => () =>
        $state.go('app.dedicated-server.server.tags.assign', {
          server,
        }),
      goToUnassignTags: /* @ngInject */ ($state, server) => (tags) =>
        $state.go('app.dedicated-server.server.tags.unassign', {
          server,
          tags,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_tags'),
    },
  });
};
