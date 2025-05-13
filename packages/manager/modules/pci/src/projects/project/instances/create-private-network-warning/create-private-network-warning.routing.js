export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.instances.create-private-network-warning',
    {
      url: '/:instanceId/create-private-network-warning',
      params: {
        instanceId: null,
      },
      views: {
        modal: {
          component: 'pciInstancesInstancesCreatePrivateNetworkWarning',
        },
      },
      layout: 'modal',
      resolve: {
        instanceId: /* @ngInject */ ($transition$) =>
          $transition$.params().instanceId,
        region: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          projectId,
          instanceId,
        ) =>
          PciProjectsProjectInstanceService.get(projectId, instanceId).then(
            ({ region }) => region,
          ),
        goBack: /* @ngInject */ (goToInstances) => goToInstances,
        goToPrivateNetworkConfigPage: /* @ngInject */ (
          getUAppUrl,
          projectId,
          region,
        ) => () =>
          getUAppUrl(
            'public-cloud',
            `#/pci/projects/${projectId}/private-networks/add?region=${region}`,
          ).then((url) => {
            window.location.href = url;
          }),
        breadcrumb: () => null,
      },
    },
  );
};
