import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.error', {
      url: '/error',
      component: 'managerErrorPage',
      params: {
        detail: null,
      },
      resolve: {
        breadcrumb: () => null,
        cancelLink: /* @ngInject */ ($state) => $state.href('pci'),
        error: /* @ngInject */ ($transition$, atInternet) => {
          const page = `public-cloud::${$transition$.to().name.replace(/\./g, '::')}`;
          const error = $transition$.params();

          atInternet.trackEvent({
            page,
            event: `PCI_ERROR_${!isEmpty(error.code) ? error.code.toUpperCase() : 'UNKNOWN'}`,
          });

          return error;
        },
        submitAction: /* @ngInject */ ($window) => () => $window.location.reload(),
      },
    });
};
