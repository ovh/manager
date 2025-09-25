import NotFound from '../pages/404.page';
import ErrorBoundary from '../components/error-boundary/ErrorBoundary.component';

const lazyLoadRoute = (importFn: CallableFunction) => {
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
// Move to <Route /> config once the breadcrumb is supported there
export default [
  {
    path: '/pci/projects/:projectId/storages/objects',
    ...lazyLoadRoute(() => import('@/pages/Root.layout')),
    children: [
      {
        path: '',
        id: 'objects',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/ObjectStorage.layout'),
        ),
        children: [
          {
            path: '',
            id: 'objects.containers',
            ...lazyLoadRoute(() =>
              import('@/pages/object-storage/containers/Containers.page'),
            ),
          },
          {
            path: 'users',
            id: 'objects.users',
            ...lazyLoadRoute(() =>
              import('@/pages/object-storage/users/Users.page'),
            ),
          },
        ],
      },
      {
        path: 'onboarding',
        id: 'onboarding',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/onboarding/Onboarding.page'),
        ),
      },
      {
        path: 'new',
        id: 'create',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/create/Create.page'),
        ),
      },
      // {
      //   path: ':serviceId',
      //   ...lazyLoadRoute(() =>
      //     import('@/pages/services/[serviceId]/Service.layout'),
      //   ),
      //   children: [
      //     {
      //       path: '',
      //       id: 'service.{service.engine}.dashboard',
      //       ...lazyLoadRoute(() =>
      //         import('@/pages/services/[serviceId]/dashboard/Dashboard.page'),
      //       ),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
