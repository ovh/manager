export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.iam-role', {
    url: '/iam',
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserIamRole',
      },
    },
    layout: { name: 'modal', backdrop: 'static' },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
