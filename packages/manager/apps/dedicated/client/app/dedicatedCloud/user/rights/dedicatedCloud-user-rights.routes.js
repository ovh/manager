export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.users.rights', {
    url: '/:userId/rights',
    params: {
      userId: null,
    },
    views: {
      pccUserView: 'dedicatedCloudUserRights',
    },
    resolve: {
      editRight: /* @ngInject */ ($state, userId) => (rightId) =>
        $state.go('app.dedicatedClouds.users.rights.edit', {
          rightId,
          userId,
        }),
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
    },
  });
};
