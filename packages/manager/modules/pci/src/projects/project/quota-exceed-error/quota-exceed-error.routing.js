export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota-exceed-error', {
    url: '/quota-exceed-error',
    views: {
      modal: {
        component: 'pciProjectQuotaExceedErrorModal',
      },
    },
    layout: 'modal',
    params: {
      cancelLabel: null,
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

      submitAction: /* @ngInject */ (submitLink) => () => {
        window.open(submitLink, '_blank', 'noopener');
      },

      message: /* @ngInject */ ($transition$) =>
        $transition$.params().message || null,

      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId || null,

      submitLabel: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLabel || null,

      submitLink: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLink || null,

      cancelLabel: /* @ngInject */ ($transition$) =>
        $transition$.params().cancelLabel || null,
    },
  });
};
