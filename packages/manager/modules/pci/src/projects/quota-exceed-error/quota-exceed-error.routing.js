export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.quota-exceed-error', {
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
      goBack: /* @ngInject */ ($state) => () => $state.go('pci.projects'),

      breadcrumb: () => null,

      submitAction: /* @ngInject */ ($window, submitLink) => () => {
        window.top.location.href = submitLink;
      },

      message: /* @ngInject */ ($transition$) =>
        $transition$.params().message || null,

      submitLabel: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLabel || null,

      submitLink: /* @ngInject */ ($transition$) =>
        $transition$.params().submitLink || null,

      cancelLabel: /* @ngInject */ ($transition$) =>
        $transition$.params().cancelLabel || null,
    },
  });
};
