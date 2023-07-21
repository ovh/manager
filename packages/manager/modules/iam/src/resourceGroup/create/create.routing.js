export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.resourceGroup.create', {
    url: '/create',
    component: 'iamCreateResourceGroup',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_resource_group_create'),
    },
  });
};
