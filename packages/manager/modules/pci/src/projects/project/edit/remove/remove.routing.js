export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.edit.remove', {
    url: '/remove',
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
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
