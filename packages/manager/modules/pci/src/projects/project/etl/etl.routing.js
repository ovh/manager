export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.etl', {
    url: '/etl',
    component: 'ovhManagerPciProjectEtl',
    redirectTo: (transition) =>
      transition
        .injector()
        .get('$q')
        .all([
          transition.injector().getAsync('isAuthorized'),
          transition.injector().getAsync('workflows'),
        ])
        .then(([isAuthorized, workflows]) =>
          !isAuthorized || workflows.length === 0
            ? { state: 'pci.projects.project.etl.onboarding' }
            : { state: 'pci.projects.project.etl.home' },
        ),
    resolve: {
      isAuthorized: /* @ngInject */ (EtlService, projectId) =>
        EtlService.getAuthorization(projectId),
      workflows: /* @ngInject */ (EtlService, projectId, isAuthorized) =>
        isAuthorized ? EtlService.getWorkflows(projectId) : [],
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_etl_title'),
      trackingPrefix: /* @ngInject */ () =>
        'PublicCloud::pci::projects::project::etl',
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      homeLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.etl.home', {
          projectId,
        }),
      cliLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.etl.cli', {
          projectId,
        }),
    },
  });
};
