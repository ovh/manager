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
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'workflows',
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
            path: 'delete',
            element: <DeleteWorkflowRedirect />,
          },
          {
            path: 'delete/:workflowId',
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteWorkflow.page'),
            ),
            handle: {
              tracking: 'delete',
            },
            children: [],
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoarding.page')),
        children: [],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
