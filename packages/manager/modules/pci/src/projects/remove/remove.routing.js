export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.remove', {
    url: '/remove?projectId',
    views: {
      modal: {
        component: 'pciProjectEditRemove',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      delete: /* @ngInject */ (OvhApiCloudProject, projectId) => () =>
        OvhApiCloudProject.v6().delete({
          serviceName: projectId,
        }).$promise,
      goBack: /* @ngInject */ ($state) => () => $state.go('pci.projects'),
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
    },
  });
};
