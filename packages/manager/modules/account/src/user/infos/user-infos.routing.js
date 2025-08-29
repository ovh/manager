export default /* @ngInject */ ($stateProvider) => {
  const name = 'account.user.infos';

  $stateProvider.state(name, {
    url: '/infos?fieldToFocus',
    component: 'userAccountComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_infos'),
      fieldToFocus: /* @ngInject */ ($stateParams) => $stateParams.fieldToFocus,
      kycStatus: /* @ngInject */ (getKycStatus) => getKycStatus(),
    },
    onExit: /* @ngInject */ (shellClient) =>
      shellClient.ux.notifyModalActionDone('SuggestionModal'),
  });
};
