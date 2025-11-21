import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Queries as TestingQueries } from '@testing-library/dom/types';
import { PropsWithChildren, ReactElement } from 'react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { MemoryRouter } from 'react-router-dom';

const shellContextValue: RecursivePartial<ShellContextType> = {
  shell: {
    navigation: {
      getURL: (_: string, path: string) =>
        Promise.resolve(`https://ovh.test/#${path}`),
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

const AllTheProviders = ({ children }: PropsWithChildren) => (
  <ShellContext.Provider value={shellContextValue as ShellContextType}>
    <MemoryRouter>{children}</MemoryRouter>
  </ShellContext.Provider>
);

export const renderWithMockedWrappers = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });
