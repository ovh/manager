export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.user.rights.edit', {
    url: '/edit/:rightId',
    params: {
      rightId: null,
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserRightsEdit',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) => {
        return goBackToState(
          'app.dedicatedCloud.details.users.user.rights',
          message,
          type,
        );
      },
      rightId: /* @ngInject */ ($transition$) => $transition$.params().rightId,
      user: /* @ngInject */ (DedicatedCloud, productId, userId) =>
        DedicatedCloud.getUserDetail(productId, userId),
      breadcrumb: () => null,
    },
  });
};
