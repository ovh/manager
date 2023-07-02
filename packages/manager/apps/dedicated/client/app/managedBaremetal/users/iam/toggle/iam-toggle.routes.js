export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.iam-toggle', {
    url: '/iam/:iamToggleState',
    params: {
      iamToggleState: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUsersIamToggle',
      },
    },
    layout: 'modal',
    resolve: {
      iamToggleState: /* @ngInject */ ($transition$) =>
        $transition$.params().iamToggleState,
      breadcrumb: () => null,
    },
  });
};
