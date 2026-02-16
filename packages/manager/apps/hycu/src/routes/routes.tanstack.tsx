import * as React from 'react'
import { Outlet } from '@tanstack/react-router'
import {
  createRootRoute,
  createRoute,
  createRouter,
  createHashHistory,
  lazyRouteComponent,
} from '@tanstack/react-router'

import { PageType } from '@ovh-ux/manager-react-shell-client'
import NotFound from '@/pages/404'
import { urls } from '@/routes/routes.constant'
import { APP_NAME } from '@/tracking.constant'

type TrackingMeta = {
  tracking?: {
    pageType?: PageType
    pageName?: string
  }
}

// Root route (no path)
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

/**
 * App layout route
 *
 * In TanStack Router, the clean way to model a layout wrapper that shouldn't
 * contribute to the URL is a **pathless layout route** (use `id`, not `path`).
 * This avoids nesting an index route under another index route (both `path: '/'`)
 * which can cause duplicate generated route IDs at runtime.
 */
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'appLayout',
  component: lazyRouteComponent(() => import('@/pages/layout')),
})

/**
 * listing
 */
const listingRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: urls.listing,
  component: lazyRouteComponent(() => import('@/pages/listing/Listing.page')),
  staticData: {
    tracking: {
      pageType: PageType.listing,
    },
  } satisfies TrackingMeta,
})

const listingTerminateRoute = createRoute({
  getParentRoute: () => listingRoute,
  // '/terminate/:serviceName' in React Router
  path: 'terminate/$serviceName',
  component: lazyRouteComponent(() => import('@/pages/terminate/terminate-hycu')),
})

/**
 * dashboard (wrapper page)
 */
const dashboardWrapperRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  // '/:serviceName' in React Router
  path: '$serviceName',
  component: lazyRouteComponent(() => import('@/pages/dashboard/Dashboard.page')),
})

/**
 * dashboard index route (path: '' in RR)
 * In TanStack: use path: '/' for the index of that parent.
 */
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardWrapperRoute,
  path: '/',
  component: lazyRouteComponent(() =>
    import('@/pages/dashboard/general-information/DashboardGeneralInformation.page'),
  ),
  staticData: {
    tracking: {
      pageName: 'general_informations',
      pageType: PageType.dashboard,
    },
  } satisfies TrackingMeta,
})

// dashboard children modals/pages
const activateLicenseRoute = createRoute({
  getParentRoute: () => dashboardIndexRoute,
  path: 'activate-license',
  component: lazyRouteComponent(() =>
    import(
      '@/pages/dashboard/general-information/activation-license-modal/ActivationLicenseModal.page'
    ),
  ),
})

const regenerateLicenseRoute = createRoute({
  getParentRoute: () => dashboardIndexRoute,
  path: 'regenerate-license',
  component: lazyRouteComponent(() =>
    import(
      '@/pages/dashboard/general-information/regenerate-license-modal/RegenerateLicenseModal.page'
    ),
  ),
})

const editNameRoute = createRoute({
  getParentRoute: () => dashboardIndexRoute,
  path: 'edit-name',
  component: lazyRouteComponent(() =>
    import(
      '@/pages/dashboard/general-information/edit-display-name/EditHycuDisplayName.page'
    ),
  ),
})

const dashboardTerminateRoute = createRoute({
  getParentRoute: () => dashboardIndexRoute,
  path: 'terminate',
  component: lazyRouteComponent(() => import('@/pages/terminate/terminate-hycu')),
})

/**
 * onboarding
 */
const onboardingRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'onboarding',
  component: lazyRouteComponent(() => import('@/pages/onboarding/Onboarding.page')),
  staticData: {
    tracking: {
      pageType: PageType.onboarding,
    },
  } satisfies TrackingMeta,
})

/**
 * order
 */
const orderRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'order',
  component: lazyRouteComponent(() => import('@/pages/order/Order.page')),
  staticData: {
    tracking: {
      pageName: `order_${APP_NAME}`,
      pageType: PageType.funnel,
    },
  } satisfies TrackingMeta,
})

/**
 * edit-pack
 */
const editPackRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  // '/:serviceName/edit-pack' in React Router
  path: '$serviceName/edit-pack',
  component: lazyRouteComponent(() => import('@/pages/edit-pack/EditPack.page')),
})

/**
 * 404 (RR: { path: '*', element: <NotFound/> })
 */
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: () => (
    <React.Suspense fallback={null}>
      <NotFound />
    </React.Suspense>
  ),
})

/**
 * Assemble the tree
 */
export const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    listingRoute.addChildren([listingTerminateRoute]),
    dashboardWrapperRoute.addChildren([
      dashboardIndexRoute.addChildren([
        activateLicenseRoute,
        regenerateLicenseRoute,
        editNameRoute,
        dashboardTerminateRoute,
      ]),
    ]),
    onboardingRoute,
    orderRoute,
    editPackRoute,
  ]),
  notFoundRoute,
])

// NOTE: TanStack Router's type definitions require `strictNullChecks: true`.
// This app currently doesn't enable it, so we opt-out of the strict type gate here.
export const router = (createRouter as any)({
  routeTree,
  history: createHashHistory(),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
