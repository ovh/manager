import React from 'react';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import OpenOrganisationsModal from './OrganisationModal.page';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = async () => {
  const context = (await initShellContext('ips')) as ShellContextType;
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <OpenOrganisationsModal />,
      },
    ],
    { initialEntries: ['/'] },
  );

  return render(
    <ShellContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ShellContext.Provider>,
  );
};

describe('Organisation Modal component', () => {
  it('should render modal when isOpen is true', async () => {
    const component = await renderComponent();
    expect(component.getByTestId('modal-title')).not.toBeNull();
  });
});
