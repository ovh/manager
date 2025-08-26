import { StorageActionRedirect } from '@/components/StorageActionRedirect';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export interface RouteHandle {
  tracking?: string;
}

const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/storages/blocks',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'blocks',
    path: ROUTE_PATHS.root,
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'blocks',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: 'attach',
            element: <StorageActionRedirect action="attach" />,
          },
          {
            path: 'attach/:volumeId',
            ...lazyRouteConfig(() =>
              import('@/pages/attach/AttachStorage.page'),
            ),
            handle: {
              tracking: 'attach',
            },
            children: [],
          },
          {
            path: 'detach',
            element: <StorageActionRedirect action="detach" />,
          },
          {
            path: 'detach/:volumeId',
            ...lazyRouteConfig(() =>
              import('@/pages/detach/DetachStorage.page'),
            ),
            handle: {
              tracking: 'detach',
            },
            children: [],
          },
          {
            path: 'delete',
            element: <StorageActionRedirect action="delete" />,
          },
          {
            path: 'delete/:volumeId',
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteStorage.page'),
            ),
            handle: {
              tracking: 'delete',
            },
            children: [],
          },
          {
            path: 'retype',
            element: <StorageActionRedirect action="retype" />,
          },
          {
            path: 'retype/:volumeId',
            ...lazyRouteConfig(() => import('@/pages/retype/Retype.page')),
            handle: {
              tracking: 'retype',
            },
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoarding.page')),
        children: [],
      },
      {
        path: ':volumeId/edit',
        id: 'edit',
        ...lazyRouteConfig(() => import('@/pages/edit/Edit.page')),
        handle: {
          tracking: 'edit',
        },
      },
      {
        path: 'new',
        ...lazyRouteConfig(() => import('@/pages/new/New.page')),
        handle: {
          tracking: 'new',
        },
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
