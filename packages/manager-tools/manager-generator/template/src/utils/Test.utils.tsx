import React from 'react';
import type { ReactElement, ReactNode } from 'react';

import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

/**
 * Wraps children in a {@link QueryClientProvider} with a fresh React Query client.
 *
 * @remarks
 * - The client is created once via `React.useState` to avoid recreating it across renders.
 * - Default query options disable automatic retries for predictable tests.
 *
 * @example
 * ```tsx
 * render(
 *   <QueryClientWrapper>
 *     <MyComponent />
 *   </QueryClientWrapper>
 * );
 * ```
 */
export function QueryClientWrapper({ children }: { children: ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false } },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

/**
 * Returns a wrapper component that mounts children inside a {@link MemoryRouter}
 * with a given initial path. Useful for testing hooks/components that require routing context.
 *
 * @param pathname - Initial URL path for the in-memory history stack.
 *
 * @example
 * ```tsx
 * const Wrapper = RouterWrapper('/about');
 * render(<MyComponent />, { wrapper: Wrapper });
 * ```
 */
export function RouterWrapper(pathname: string) {
  // eslint-disable-next-line react/display-name,react/no-multi-comp
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>
  );
}

/**
 * Renders a component inside a {@link MemoryRouter} with `/` as the starting path.
 *
 * @param children - The element tree to render.
 *
 * @example
 * ```tsx
 * const { getByText } = renderWithRouter(<MyComponent />);
 * ```
 */
export const renderWithRouter = (children: ReactNode) =>
  render(<MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>);

/**
 * Renders a layout component with nested test routes for verifying layout and routing behavior.
 *
 * @param initialPath - Path to start navigation from (defaults to `/listing`).
 * @param ui - The layout or component to render as the root route element.
 *
 * @example
 * ```tsx
 * renderWithLayout('/settings', <MainLayout />);
 * ```
 */
export const renderWithLayout = (initialPath = '/listing', ui: ReactElement) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={ui}>
          <Route path="listing" element={<div>Listing Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="tracked" element={<div>Tracked Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
