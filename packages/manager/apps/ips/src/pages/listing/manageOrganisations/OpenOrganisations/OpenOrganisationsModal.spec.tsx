import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OpenOrganisationsModal from './OpenOrganisationsModal.page';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = (isOpen: boolean) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <OpenOrganisationsModal isOpen={isOpen}></OpenOrganisationsModal>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Organisation Modal component', () => {
  it('should render modal when isOpen is true', () => {
    expect(renderComponent(true).getByTestId('modal-title')).not.toBeNull();
  });
});
