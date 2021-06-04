import Notebook from '../Notebook.class';
import { NOTEBOOK_POLLER_NAMESPACES } from '../notebook.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.notebooks.dashboard', {
    url: '/:notebookId',
    component: 'ovhManagerPciProjectNotebooksDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (notebook) => notebook.id,

      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      notebookId: /* @ngInject */ ($transition$) =>
        $transition$.params().notebookId,

      notebook: /* @ngInject */ (notebooks, notebookId) => {
        return notebooks.find(({ id }) => id === notebookId);
      },

      generalInformationLink: /* @ngInject */ ($state, projectId, notebookId) =>
        $state.href(
          'pci.projects.project.notebooks.dashboard.general-information',
          {
            projectId,
            notebookId,
          },
        ),

      attachDataLink: /* @ngInject */ ($state, projectId, notebookId) =>
        $state.href('pci.projects.project.notebooks.dashboard.attach-data', {
          projectId,
          notebookId,
        }),

      killTasks: /* @ngInject */ (Poller) => (pattern) => Poller.kill(pattern),

      needRefresh: /* @ngInject */ (notebook) => () =>
        notebook.isStarting() || notebook.isStopping(),

      waitNotebookToStartOrStop: /* @ngInject */ (
        projectId,
        notebook,
        NotebookService,
        Poller,
      ) => () => {
        const endPointUrl = NotebookService.buildGetNotebookUrl(
          projectId,
          notebook.id,
        );
        return Poller.poll(endPointUrl, null, {
          interval: 2500,
          successRule(notebookResponse) {
            const n = new Notebook(notebookResponse, null);
            return n.isRunning() || n.isStopped();
          },
          namespace: NOTEBOOK_POLLER_NAMESPACES.CHANGING,
          notifyOnError: false,
        });
      },
    },
    redirectTo: 'pci.projects.project.notebooks.dashboard.general-information',
  });
};
