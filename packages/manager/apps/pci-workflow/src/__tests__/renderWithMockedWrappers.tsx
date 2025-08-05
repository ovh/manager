import { PropsWithChildren, ReactElement } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { RenderOptions, render } from '@testing-library/react';

const AllTheProviders = ({ children }: PropsWithChildren) => (
  <MemoryRouter>{children}</MemoryRouter>
);

export const renderWithMockedWrappers = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });
