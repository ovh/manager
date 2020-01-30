import { MESSAGES_CONTAINER_NAME } from './edit.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.edit', {
    url: '/edit',
    views: {
      contentTab: 'pciProjectEdit',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_parameters'),
      onUpdate: /* @ngInject */ (
        $state,
        $timeout,
        $translate,
        CucCloudMessage,
      ) => () =>
        $state
          .reload()
          // We need a digest so message can be displayed
          .then(() =>
            $timeout(() =>
              CucCloudMessage.success(
                $translate.instant('pci_projects_project_edit_update_success'),
                MESSAGES_CONTAINER_NAME,
              ),
            ),
          ),
      /* @ngInject */
      setDefault: (PciProjectsService) => (projectId) =>
        PciProjectsService.setAsDefaultProject(projectId),
      /* @ngInject */
      unFavProject: (PciProjectsService) => () =>
        PciProjectsService.removeDefaultProject(),
    },
  });
};
