import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { MemoryRouter } from 'react-router-dom';
import { queries, Queries } from '@testing-library/dom';
import * as ReactDOMClient from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const shellContextValue: RecursivePartial<ShellContextType> = {
  shell: {
    navigation: {
      getURL: (_, path) => Promise.resolve(`https://ovh.test/#${path}`),
    },
    ux: {
      hidePreloader: () => Promise.resolve(),
    },
    tracking: {
      trackClick: () => {},
    },
  },
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
    getRegion: () => 'EU',
  },
};

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const getAllTheProviders = () => ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={getQueryClient()}>
    <ShellContext.Provider value={shellContextValue as ShellContextType}>
      <MemoryRouter>{children}</MemoryRouter>
    </ShellContext.Provider>
  </QueryClientProvider>
);

export const renderWithMockedWrappers = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: getAllTheProviders(), ...options });

// Thoses two types come from a copy-paste from the @testing-library/react library
type RendererableContainer = ReactDOMClient.Container;
type HydrateableContainer = Parameters<typeof ReactDOMClient['hydrateRoot']>[0];

export const renderHookWithMockedWrappers = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends RendererableContainer | HydrateableContainer = HTMLElement,
  BaseElement extends RendererableContainer | HydrateableContainer = Container
>(
  toRender: (initialProps: Props) => Result,
  options?: Omit<
    RenderHookOptions<Props, Q, Container, BaseElement>,
    'wrapper'
  >,
) => renderHook(toRender, { wrapper: getAllTheProviders(), ...options });
