import ErrorBoundary from '@/components/error-boundary/ErrorBoundary.component';
import NotFound from '@/pages/404.page';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        loader: moduleExports?.Loader,
        ErrorBoundary,
        handle: {
          breadcrumb: moduleExports.breadcrumb,
        },
        ...moduleExports,
      };
    },
  };
};

export const COMMON_PATH = '/pci/projects';

export default [
  {
    path: '/pci/projects/:projectId/ai/notebooks',
    ...lazyRouteConfig(() => import('@/pages/Root.layout')),
    children: [
      {
        path: '',
        id: 'notebooks',
        ...lazyRouteConfig(() => import('@/pages/Root.page')),
      },
      {
        path: 'new',
        id: 'create',
        ...lazyRouteConfig(() =>
          import('@/pages/notebooks/create/Create.page'),
        ),
      },
      {
        path: ':notebookId',
        ...lazyRouteConfig(() =>
          import('@/pages/notebooks/[notebookId]/Notebook.layout'),
        ),
        children: [
          {
            path: '',
            id: 'notebook.dashboard',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/[notebookId]/dashboard/Dashboard.page'),
            ),
          },
          {
            path: 'attach-data',
            id: 'notebook.attach-data',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/notebooks/[notebookId]/attached-data/AttachedData.page'
              ),
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
