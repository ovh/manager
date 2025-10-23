import { PropsWithChildren, ReactElement } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { RenderOptions, render } from '@testing-library/react';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

const shellContextValue: RecursivePartial<ShellContextType> = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'test' }),
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
) => render(ui, { wrapper: AllTheProviders, ...options });
