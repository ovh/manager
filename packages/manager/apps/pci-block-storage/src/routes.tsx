import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
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

const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/storages/blocks',
};

const ROUTES: RouteObject[] = [
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
          tracking: { pageType: PageType.listing },
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
              tracking: {
                pageName: 'attach_instance',
                pageType: PageType.popup,
              },
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
              pageName: 'detach_instance',
              pageType: PageType.popup,
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
              tracking: {
                pageName: 'delete_volume_block_storage',
                pageType: PageType.popup,
              },
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
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        },
        children: [],
      },
      {
        path: ':volumeId/edit',
        id: 'edit',
        ...lazyRouteConfig(() => import('@/pages/edit/Edit.page')),
        handle: {
          tracking: {
            pageName: 'edit_volume_block_storage',
            pageType: PageType.funnel,
          },
        },
      },
      {
        path: 'new',
        ...lazyRouteConfig(() => import('@/pages/new/New.page')),
        handle: {
          tracking: {
            pageName: 'create_volume_block_storage',
            pageType: PageType.funnel,
          },
        },
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];

export default ROUTES;
