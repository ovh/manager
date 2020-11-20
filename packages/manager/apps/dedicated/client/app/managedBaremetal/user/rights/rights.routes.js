export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.user.rights', {
    url: '/rights',
    views: {
      pccUserView: 'dedicatedCloudUserRights',
    },
    resolve: {
      editRight: /* @ngInject */ ($state, userId) => (rightId) =>
        $state.go('app.managedBaremetal.details.users.user.rights.edit', {
          rightId,
          userId,
        }),
    },
  });
};
