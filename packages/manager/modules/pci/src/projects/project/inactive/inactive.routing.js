export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.inactive', {
    url: '/inactive',
    views: {
      modal: {
        component: 'pciProjectInactive',
      },
    },
    layout: 'modal',
    params: {
      project: null,
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project'),
      goToBilling: /* @ngInject */ ($window, billingUrl) => () =>
        $window.location.assign(billingUrl),
      project: /* @ngInject */ ($transition$) => $transition$.params().project,
    },
  });
};
