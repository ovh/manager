import { render, RenderOptions } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

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
    getUser: () => ({ ovhSubsidiary: 'test' }),
    getRegion: () => 'EU',
  },
};

const AllTheProviders = ({ children }: PropsWithChildren) => (
  <ShellContext.Provider value={shellContextValue as ShellContextType}>
    {children}
  </ShellContext.Provider>
);

export const renderWithMockedWrappers = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });
