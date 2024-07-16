import DeleteWorkflowRedirect from '@/components/DeleteWorkflowRedirect';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/workflow',
  executions: ':workflowId/executions',
  onboarding: 'onboarding',
  delete: 'delete',
  deleteWorkflow: 'delete/:workflowId',
  new: 'new',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'workflow',
    path: ROUTE_PATHS.root,
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'workflows',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: ROUTE_PATHS.delete,
            element: <DeleteWorkflowRedirect />,
          },
          {
            path: ROUTE_PATHS.deleteWorkflow,
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteWorkflow.page'),
            ),
            handle: {
              tracking: 'delete',
            },
          },
        ],
      },
      {
        path: ROUTE_PATHS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoarding.page')),
      },
      {
        path: ROUTE_PATHS.executions,
        handle: {
          tracking: 'executions',
        },
        ...lazyRouteConfig(() => import('@/pages/executions/Executions.page')),
      },
      {
        path: ROUTE_PATHS.new,
        handle: {
          tracking: 'new',
        },
        ...lazyRouteConfig(() => import('@/pages/new/New.page')),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
