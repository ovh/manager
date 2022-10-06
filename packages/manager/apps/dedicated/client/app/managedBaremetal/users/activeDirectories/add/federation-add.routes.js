export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.federation-add', {
    url: '/federation/add',
    views: {
      'dedicatedCloudView@app.managedBaremetal.details':
        'dedicatedCloudUsersFederationAdd',
    },
    resolve: {
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicatedCloud_USER_AD_ADD_title'),
    },
    atInternet: {
      rename:
        'dedicated::managedBaremetal::details::users::add-active-directory',
    },
  });
};
