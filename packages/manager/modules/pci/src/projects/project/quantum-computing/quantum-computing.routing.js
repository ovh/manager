import find from 'lodash/find';
import merge from 'lodash/merge';

import get from 'lodash/get';
import Notebook from './QuantumComputing.class';
import { NOTEBOOK_STATUS } from './quantum-computing.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quantum-computing', {
    url: '/quantum',
    component: 'ovhManagerPciProjectQuantumComputing',
    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('notebooks'),
        transition.injector().getAsync('isAuthorized'),
      ]).then(([notebooks, isAuthorized]) =>
        notebooks.length === 0 || !isAuthorized
          ? { state: 'pci.projects.project.quantum-computing.onboarding' }
          : false,
      ),
    resolve: {
      isAuthorized: /* @ngInject */ (QuantumService, projectId) =>
        QuantumService.isAuthorized(projectId),

      goToAddNotebook: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.quantum-computing.add', { projectId }),

      notebooks: /* @ngInject */ (
        editors,
        frameworks,
        QuantumService,
        projectId,
        coreConfig,
        ovhManagerRegionService,
        isAuthorized,
      ) =>
        isAuthorized
          ? QuantumService.getQuantumComputing(projectId).then((notebooks) =>
              notebooks.map(
                (notebook) =>
                  new Notebook(
                    merge({}, notebook, {
                      spec: {
                        env: {
                          editor: find(editors, {
                            id: notebook.spec.env.editorId,
                          }),
                          framework: find(frameworks, {
                            id: notebook.spec.env.frameworkId,
                          }),
                        },
                      },
                    }),
                    coreConfig.getUser().ovhSubsidiary,
                    ovhManagerRegionService.getRegion(notebook.spec.region),
                  ),
              ),
            )
          : [],

      editors: /* @ngInject */ (QuantumService, projectId) =>
        QuantumService.getEditors(projectId),

      frameworks: /* @ngInject */ (QuantumService, projectId) =>
        QuantumService.getFrameworks(projectId),

      goToQuantumComputing: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.quantum-computing';

        const promise = $state.go(
          state,
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, state));
        }

        return promise;
      },

      goToNotebook: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        notebook,
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const stateName =
          'pci.projects.project.quantum-computing.dashboard.general-information';

        const promise = $state.go(
          stateName,
          {
            projectId,
            notebookId: notebook.id,
          },
          {
            reload,
          },
        );
        return message
          ? promise.then(() => {
              CucCloudMessage.flushMessages(stateName);
              CucCloudMessage[type](message, stateName);
            })
          : promise;
      },

      goToDeleteNotebook: /* @ngInject */ ($state, projectId) => (notebook) =>
        $state.go('pci.projects.project.quantum-computing.delete', {
          projectId,
          notebook,
        }),

      goToAttachData: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.quantum-computing.dashboard.attach-data',
          {
            projectId,
          },
        ),

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },

      notebookLink: /* @ngInject */ ($state, projectId) => (notebook) =>
        $state.href('pci.projects.project.quantum-computing.dashboard', {
          projectId,
          notebookId: notebook.id,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_notebook_list_title'),

      messageContainer: () => 'pci.projects.project.quantum-computing',

      startNotebook: /* @ngInject */ (
        $translate,
        projectId,
        notebooks,
        pollNotebookStatus,
        messageContainer,
        QuantumService,
        CucCloudMessage,
      ) => (notebookId) => {
        const notebook = find(notebooks, { id: notebookId });
        QuantumService.startNotebook(projectId, notebookId).then(
          () => {
            notebook.setState(NOTEBOOK_STATUS.STARTING);
            pollNotebookStatus();
          },
          (error) => {
            CucCloudMessage.error(
              $translate.instant('pci_notebook_list_start_error', {
                notebookName: notebook.name,
                message: get(error, 'data.message'),
              }),
              messageContainer,
            );
          },
        );
      },

      stopNotebook: /* @ngInject */ (
        $translate,
        projectId,
        notebooks,
        pollNotebookStatus,
        messageContainer,
        QuantumService,
        CucCloudMessage,
      ) => (notebookId) => {
        const notebook = find(notebooks, { id: notebookId });
        QuantumService.stopNotebook(projectId, notebookId).then(
          () => {
            notebook.setState(NOTEBOOK_STATUS.STOPPING);
            pollNotebookStatus();
          },
          (error) => {
            CucCloudMessage.error(
              $translate.instant('pci_notebook_list_stop_error', {
                notebookName: notebook.name,
                message: get(error, 'data.message'),
              }),
              messageContainer,
            );
          },
        );
      },

      pollNotebookStatus: /* @ngInject */ (
        QuantumService,
        notebooks,
        projectId,
      ) => () => {
        notebooks.forEach((notebook) => {
          if (notebook.isPending()) {
            QuantumService.pollNotebookStatus(
              projectId,
              notebook.id,
            ).then((notebookInfo) => notebook.updateData(notebookInfo));
          }
        });
      },

      stopPollingNotebookStatus: /* @ngInject */ (
        QuantumService,
        notebooks,
        projectId,
      ) => () =>
        notebooks.forEach((notebook) =>
          QuantumService.stopPollingNotebookStatus(projectId, notebook.id),
        ),

      notebooksTrackPrefix: () =>
        'PublicCloud::pci::projects::project::ai_machine_learning::notebooks',

      trackQuantumComputing: /* @ngInject */ (
        notebooksTrackPrefix,
        trackClick,
        trackPage,
      ) => (complement, type = 'action', prefix = true) => {
        const name = `${
          prefix ? `${notebooksTrackPrefix}::` : ''
        }${complement}`;
        switch (type) {
          case 'action':
          case 'navigation':
            trackClick(name, type);
            break;
          case 'page':
            trackPage(name);
            break;
          default:
            trackClick(name);
        }
      },

      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        atInternet.trackClick({
          name: hit,
          type,
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackPage({
          name: hit,
        });
      },
    },
  });
};
