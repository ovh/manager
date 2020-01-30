import values from 'lodash/values';

import { KIND } from '../streams.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.add', {
    url: '/new',
    component: 'ovhManagerPciStreamsAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_streams_add_title'),
      cancelLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.streams', {
          projectId,
        }),
      regions: /* @ngInject */ (ovhManagerPciStreamsAdd, projectId) =>
        ovhManagerPciStreamsAdd.getAvailableRegions(projectId),
      types: () => values(KIND),
      addStream: /* @ngInject */ (
        $translate,
        goToStreams,
        ovhManagerPciStreamsAdd,
        projectId,
      ) => (streamCreation) =>
        ovhManagerPciStreamsAdd
          .addStream(projectId, streamCreation)
          .then(({ name }) =>
            goToStreams(
              $translate.instant('pci_projects_project_streams_add_success', {
                name,
              }),
            ),
          ),
    },
  });
};
