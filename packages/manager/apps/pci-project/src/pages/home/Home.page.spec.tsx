/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { useParams } from 'react-router-dom';
import { setupAllMocks, mockDashboardSections } from '@/data/__mocks__';

import Home from './Home.page';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';

setupAllMocks();

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'memory-router' }, children),
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => React.createElement('a', { href: to, ...props }, children),
}));

vi.mock('./components/useDashboardSections.hook', () => ({
  useDashboardSections: () => ({
    sections: mockDashboardSections.map((s) => ({
      title: s.title,
      type: 'documentation',
      items: s.items,
    })),
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

describe('Home', () => {
  it('throws error when project id is missing', async () => {
    // Suppress console errors for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => render(<Home />)).toThrowError(
      'pci_project_project_project_identifier_missing',
    );

    // Restore console.error
    console.error = originalError;
  });

  it('renders dashboard and quick access when project id provided', async () => {
    vi.mocked(useParams).mockReturnValue({ projectId: '1' });
    const wrapper = createOptimalWrapper({ routing: true, shell: true });
    render(<Home />, { wrapper });
    expect(screen.getByTestId('memory-router')).toBeInTheDocument();
    expect(screen.getAllByTestId('ods-card').length).toBeGreaterThan(0);
  });
});
