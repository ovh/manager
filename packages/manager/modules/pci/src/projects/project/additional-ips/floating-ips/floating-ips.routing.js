export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.floating-ips', {
    url: '/floating-ips?ip',
    views: {
      ipView: 'pciProjectAdditionalIpsFloatingIps',
    },
    params: {
      ip: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      additionalIp: /* @ngInject */ ($transition$) => $transition$.params().ip,
      floatingIps: /* @ngInject */ (additionalIps) => additionalIps.floatingIps,
      goToEditInstance: /* @ngInject */ ($state, projectId) => (serviceName) =>
        $state.go('pci.projects.project.additional-ips.floating-ips.edit', {
          projectId,
          serviceName,
        }),
      goToTerminate: /* @ngInject */ ($state, projectId) => (serviceName) =>
        $state.go(
          'pci.projects.project.additional-ips.floating-ips.terminate',
          {
            projectId,
            serviceName,
          },
        ),
      goToInstance: /* @ngInject */ ($state, projectId) => (instanceId) =>
        $state.href('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
    },
  });
};
