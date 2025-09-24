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
        ...lazyLoadRoute(() => import('@/pages/Root.page')),
        children: [],
      },
      {
        path: 'onboarding',
        id: 'onboarding',
        ...lazyLoadRoute(() =>
          import('@/pages/containers/onboarding/Onboarding.page'),
        ),
      },
      {
        path: 'new',
        id: 'create',
        ...lazyLoadRoute(() => import('@/pages/containers/create/Create.page')),
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
