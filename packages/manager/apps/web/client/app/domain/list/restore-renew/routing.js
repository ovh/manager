import { DOMAIN_PREFIX_POPUP_RENEW_RESTORE } from '../../../domains/domains.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.index.restore-renew', {
    url: '/restore-renew',
    params: {
      domains: {
        array: true,
        value: [],
      },
    },
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      domains: /* @ngInject */ ($transition$) => $transition$.params().domains,
      title: /* @ngInject */ (domains, $translate) =>
        $translate.instant('domains_restore_renew_modal_title', {
          number: domains.length,
        }),
    },
    views: {
      modal: {
        component: 'webdomainRestoreRenewModale',
      },
    },
    atInternet: {
      rename: DOMAIN_PREFIX_POPUP_RENEW_RESTORE,
    },
    layout: 'modal',
  });
};
