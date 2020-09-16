import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.error', {
    url: '/error',
    views: {
      modal: {
        component: 'pciProjectErrorModal',
      },
    },
    layout: 'modal',
    params: {
      message: null,
      projectId: null,
      submitLabel: null,
      submitLink: null,
    },
    resolve: {
      goBack: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project', {
          projectId,
        }),

      breadcrumb: () => null,

      submitAction: /* @ngInject */ ($window, submitLink) => () => {
        set($window, 'location.href', submitLink);
      },

      message: /* @ngInject */ ($transition$) =>
        $transition$.params().message || null,

      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId || null,

      submitLabel: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLabel || null,

      submitLink: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLink || null,
    },
  });
};
