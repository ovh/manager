export default /* @ngInject */ ($stateProvider) => {
  const name = 'account.identity-documents';

  $stateProvider.state(name, {
    url: '/identity-documents',
    component: 'dedicatedAccountUserIdentityDocuments',
    translations: {
      format: 'json',
      value: ['.'],
    },
    resolve: {
      kycStatus: /* @ngInject */ (getKycStatus) => getKycStatus(),
      needkyc: /* @ngInject */ (isKycFeatureAvailable, kycStatus) => {
        if (isKycFeatureAvailable) {
          return ['required', 'open'].includes(kycStatus.status);
        }
        return false;
      },
      breadcrumb: /* @ngInject */ () => null,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('needkyc')
        .then((needkyc) =>
          needkyc ? false : { state: 'account.user.dashboard' },
        ),
    onExit: /* @ngInject */ (shellClient) =>
      shellClient.ux.notifyModalActionDone('IdentityDocumentsModal'),
  });
};
