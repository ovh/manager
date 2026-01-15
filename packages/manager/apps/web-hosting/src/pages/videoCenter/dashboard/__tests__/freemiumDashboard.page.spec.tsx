import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import FreemiumDashboardPage from '../freemiumDashboard.page';

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual<typeof import('@ovh-ux/muk')>('@ovh-ux/muk');
  return {
    ...actual,
    useFormatDate: () => (params: { date: string; format: string }) => {
      return `formatted-${params.date}`;
    },
  };
});

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: vi.fn(() => ({ serviceId: 'test-service-id' })),
  };
});

describe('FreemiumDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render freemium-specific layout', () => {
    const { container } = render(<FreemiumDashboardPage />, { wrapper });

    expect(container).toBeInTheDocument();
  });

  it('should display offer information', async () => {
    const { getByText } = render(<FreemiumDashboardPage />, { wrapper });

    await waitFor(() => {
      expect(getByText('Premium')).toBeInTheDocument();
    });
  });

  it('should render Contacts component', () => {
    const { getByText } = render(<FreemiumDashboardPage />, { wrapper });

    expect(getByText('Contacts')).toBeInTheDocument();
  });

  it('should display creation date', () => {
    const { container } = render(<FreemiumDashboardPage />, { wrapper });

    expect(container).toBeInTheDocument();
  });
});
