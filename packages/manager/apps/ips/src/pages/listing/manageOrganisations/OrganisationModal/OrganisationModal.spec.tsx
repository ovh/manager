import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OpenOrganisationsModal from './OrganisationModal.page';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = () => {
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

describe('Organisation Modal component', () => {
  it('should render modal when isOpen is true', () => {
    expect(renderComponent().getByTestId('modal-title')).not.toBeNull();
  });
});
