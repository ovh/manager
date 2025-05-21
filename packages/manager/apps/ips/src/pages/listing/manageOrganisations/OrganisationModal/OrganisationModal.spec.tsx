import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OpenOrganisationsModal from './OrganisationModal.page';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <OpenOrganisationsModal />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Organisation Modal component', () => {
  it('should render modal when isOpen is true', () => {
    expect(renderComponent().getByTestId('modal-title')).not.toBeNull();
  });
});
