export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks', {
    url: '/notebooks',
    component: 'ovhManagerPciProjectNotebooks',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('notebooks')
        .then((notebooks) =>
          notebooks.length === 0
            ? { state: 'pci.projects.project.notebooks.onboarding' }
            : false,
        ),
    resolve: {
      goToAddNotebook: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.notebooks.add', { projectId }),
      notebooks: /* @ngInject */ ($q, NotebookService, projectId) =>
        NotebookService.getNotebooks(projectId),

      goToNotebooks: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.notebooks';

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
          'pci.projects.project.notebooks.dashboard.general-information';

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
        $state.go('pci.projects.project.notebooks.delete', {
          projectId,
          notebook,
        }),

      goToAttachData: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.notebooks.dashboard.attach-data', {
          projectId,
        }),

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_notebook_list_title'),

      notebooksTrackPrefix: () =>
        'PublicCloud::pci::projects::project::notebooks',

      trackNotebooks: /* @ngInject */ (
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
