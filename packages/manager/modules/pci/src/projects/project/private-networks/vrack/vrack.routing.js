import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.vrack', {
    url: '/onboarding',
    component: 'pciProjectPrivateNetworksVrack',
    resolve: {
      createVrack: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.privateNetwork.vrack.new', {
          projectId,
        }),
      onVrackCreated: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.privateNetwork',
          { projectId },
          { reload: true },
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_network_private'),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('vrack')
        .then((vrack) =>
          isEmpty(vrack)
            ? false
            : { state: 'pci.projects.project.privateNetwork' },
        ),
  });
};
