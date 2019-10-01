import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';


export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.error', {
      url: '/error',
      component: 'managerErrorPage',
      params: {
        code: {
          type: 'any',
        },
        context: {
          type: 'any',
        },
        detail: null,
        message: {
          type: 'any',
        },
      },
      resolve: {
        breadcrumb: () => null,
        cancelLink: /* @ngInject */ $state => $state.href('pci'),
        error: /* @ngInject */ ($transition$, atInternet) => {
          const page = `public-cloud::${$transition$.to().name.replace(/\./g, '::')}`;
          const stateParams = $transition$.params();
          const error = {
            ...stateParams,
            code: snakeCase(stateParams.code),
          };

          atInternet.trackEvent({
            page,
            event: `PCI_ERROR_${!isEmpty(error.code) ? error.code.toUpperCase() : 'UNKNOWN'}`,
          });

          return error;
        },
        submitAction: /* @ngInject */ $window => () => $window.location.reload(),
      },
    });
};
