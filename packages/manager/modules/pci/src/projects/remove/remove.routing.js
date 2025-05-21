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
      isUs: /* @ngInject */ (coreConfig) => coreConfig.isRegion('US'),
      serviceInfo: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.ServiceInfos()
          .v6()
          .get({
            serviceName: projectId,
          }),
      delete: /* @ngInject */ (
        $http,
        isUs,
        OvhApiCloudProject,
        projectId,
        serviceInfo,
      ) => () => {
        if (isUs) {
          return $http.delete(`/services/${serviceInfo.serviceId}`);
        }
        return OvhApiCloudProject.v6().delete({
          serviceName: projectId,
        }).$promise;
      },
      goBack: /* @ngInject */ ($state) => () => $state.go('pci.projects'),
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
    },
  });
};
