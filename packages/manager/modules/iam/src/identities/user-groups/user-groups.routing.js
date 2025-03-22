export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities.user-groups', {
    url: '/user-groups',
    component: 'iamUserGroups',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_identities_user_groups'),
    },
  });
};
