export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.failover-ips', {
    url: '/additional-ips?ip',
    views: {
      ipView: 'pciProjectAdditionalIpsFailoverIps',
    },
    params: {
      ip: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() =>
            $translate.instant('pci_additional_ips_failover_ip_title'),
          ),
      additionalIp: /* @ngInject */ ($transition$) => $transition$.params().ip,
      additionalIpsRegions: /* @ngInject */ (failoverIps) =>
        Array.from(new Set(failoverIps.map(({ geoloc }) => geoloc))),
      failoverIps: /* @ngInject */ (additionalIps) => additionalIps.failoverIps,
      goToEditInstance: /* @ngInject */ ($state, projectId, trackClick) => (
        serviceName,
      ) => {
        trackClick('failover-ips::table-option-menu::edit');
        return $state.go(
          'pci.projects.project.additional-ips.failover-ips.edit',
          {
            projectId,
            serviceName,
          },
        );
      },
      goToTerminate: /* @ngInject */ ($state, projectId, trackClick) => (
        serviceName,
      ) => {
        trackClick('failover-ips::table-option-menu::delete');
        return $state.go(
          'pci.projects.project.additional-ips.failover-ips.terminate',
          {
            projectId,
            serviceName,
          },
        );
      },
      goToInstance: /* @ngInject */ ($state, projectId) => (instanceId) =>
        $state.href('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
      goToImportFailoverIps: /* @ngInject */ (
        $state,
        projectId,
        trackClick,
      ) => () => {
        trackClick('PCI_PROJECTS_FAILOVER_IP_IMPORT', false);
        return $state.go('pci.projects.project.additional-ips.imports', {
          projectId,
        });
      },
    },
  });
};
