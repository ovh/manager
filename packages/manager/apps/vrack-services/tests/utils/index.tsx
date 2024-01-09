/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RenderOptions, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { initShell } from '@ovh-ux/shell';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Environment } from '@ovh-ux/manager-config';
import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';
import { setupServer } from 'msw/node';
import { ConfigParams, getMswHandlers } from '../../mock/handlers';
import i18n from './i18nTestConfig';
import { ApplicationProvider } from './ApplicationProvider';
import Listing from '../../src/pages/index/index';
import CreateVs from '../../src/pages/create/index';
import Overview from '../../src/pages/dashboard/[id]/index';
import Onboarding from '../../src/pages/onboarding/index';
import CreateEndpoint from '../../src/pages/dashboard/[id]/CreateEndpoint';
import CreateSubnet from '../../src/pages/dashboard/[id]/CreateSubnet';

jest.mock('../../src/components/Breadcrumb.tsx');

export { labels } from './i18nTestConfig';
export * from './msw-helpers';

export const routeUrls = {
  onboarding: '/onboarding',
  listing: '/',
  create: '/create',
  dashboard: '/:id',
  subnets: '/:id/Subnets',
  endpoints: '/:id/Endpoints',
  createSubnet: '/:id/createsubnet',
  createEndpoint: '/:id/createendpoint',
};

export type TestConfig = {
  environment?: Environment;
  initialRoute?: string;
} & RenderOptions &
  ConfigParams;

export const renderWithShell = async (options?: TestConfig) => {
  const server = setupServer(
    ...getMswHandlers(options, [
      {
        url: '/vrackServices/reference/zone',
        response: [{ test: 'nico' }],
        status: 202,
        statusText: 'NICO',
        api: 'v2',
      },
      {
        url: '/configuration',
        api: 'aapi',
        response: {},
      },
      {
        url: '/flags/:country',
        baseUrl: 'http://localhost',
        response: '',
      },
    ]),
  );
  server.listen({ onUnhandledRequest: 'warn' });
  server.events.on('request:start', async ({ request }) => {
    console.log('MSW intercepted:', request.method, request.url);
  });

  const shell = await initShell();
  const queryClient = new QueryClient();

  const routes: RouteObject[] = [
    {
      path: routeUrls.onboarding,
      Component: Onboarding,
    },
    {
      path: routeUrls.listing,
      Component: Listing,
    },
    {
      path: routeUrls.create,
      Component: CreateVs,
    },
    {
      path: routeUrls.dashboard,
      Component: Overview,
    },
    {
      path: routeUrls.createEndpoint,
      Component: CreateEndpoint,
    },
    {
      path: routeUrls.createSubnet,
      Component: CreateSubnet,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [options?.initialRoute || routeUrls.listing],
    initialIndex: 0,
  });

  const testContext = render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider environment={options?.environment} shell={shell}>
          <RouterProvider router={router} />
        </ApplicationProvider>
      </QueryClientProvider>
    </I18nextProvider>,
    options,
  );

  return { ...testContext, server, queryClient };
};
