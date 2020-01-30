import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.error', {
    url: '/error',
    component: 'managerErrorPage',
    params: {
      detail: null,
      submitLabel: null,
      submitLink: null,
      submitAction: null,
      message: null,
      image: null,
    },
    resolve: {
      breadcrumb: () => null,
      cancelLink: /* @ngInject */ ($state) => $state.href('pci'),
      error: /* @ngInject */ ($transition$, atInternet) => {
        const page = `public-cloud::${$transition$
          .to()
          .name.replace(/\./g, '::')}`;
        const error = $transition$.params();

        atInternet.trackEvent({
          page,
          event: `PCI_ERROR_${
            !isEmpty(error.code) ? error.code.toUpperCase() : 'UNKNOWN'
          }`,
        });

        return error;
      },
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),

      message: /* @ngInject */ ($transition$) =>
        $transition$.params().message || null,

      image: /* @ngInject */ ($transition$) =>
        $transition$.params().image || null,

      submitLabel: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLabel || null,

      submitLink: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLink || null,
    },
  });
};
