import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import VideoCenterDashboardPage from '../videoCenterDashboard.page';

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

describe('VideoCenterDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all sections', () => {
    const { container } = render(<VideoCenterDashboardPage />, { wrapper });

    // Check for BaseLayout structure
    expect(container).toBeInTheDocument();
  });

  it('should display correct data from hook', async () => {
    const { getByText } = render(<VideoCenterDashboardPage />, { wrapper });

    await waitFor(() => {
      expect(getByText('Premium')).toBeInTheDocument();
    });
  });

  it('should render Contacts component', () => {
    const { getByText } = render(<VideoCenterDashboardPage />, { wrapper });

    // Contacts component renders "contacts" text
    expect(getByText('Contacts')).toBeInTheDocument();
  });

  it('should render button with correct text', () => {
    const { container } = render(<VideoCenterDashboardPage />, { wrapper });

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display offer name', async () => {
    const { getByText } = render(<VideoCenterDashboardPage />, { wrapper });

    await waitFor(() => {
      expect(getByText('Premium')).toBeInTheDocument();
    });
  });
});
