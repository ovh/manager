export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('identity-check', {
    url: '/identity-check',
    component: 'identityCheckForm',
    resolve: {
      $title: ($translate) =>
        $translate('telecom_dashboard_identity_check_form_title'),
      hideBreadcrumb: () => true,
    },
  });
};
