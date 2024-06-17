export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.federation-add', {
    url: '/federation/add',
    views: {
      'dedicatedCloudView@app.dedicatedCloud.details':
        'dedicatedCloudUsersFederationAdd',
    },
    resolve: {
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicatedCloud_USER_AD_ADD_title'),
    },
    atInternet: {
      rename: 'dedicated::dedicatedCloud::details::users::add-active-directory',
    },
  });
};
