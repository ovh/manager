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
      to: null,
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
      product: /* @ngInject */ ($state, $transition$) => {
        const { state, params } = $transition$.params().to;
        const url = $state.href(state, params, { lossy: true }).split('/');
        // url of all states follow #/pci/projects/projectId/(instance/storages/load-balancer)
        // if type of product is present, pick it otherwise generalise the label 'pci-project'
        // URI params are removed from error tracking
        const subproduct = url[4]?.split('?')[0] || 'project';
        return `${url[1]}-${subproduct}`;
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
    atInternet: {
      ignore: true,
    },
  });
};
