import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';
import { Mock, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TrackingTranfert from '@/pages/tracking/Tracking';
import { wrapper } from '@/utils/test.provider';

import {
  trackingAuthError,
  trackingContactConfirmation,
  trackingCurrentRegistrarConfirmation,
  trackingDone,
  trackingFinalization,
  trackingInit,
} from '@/__mocks__/tracking';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: () => {
    return {
      id: '1',
    };
  },
}));

vi.mock('@ovh-ux/manager-core-utils', () => ({
  getDateFnsLocale: vi.fn(),
}));

describe('Tracking page', () => {
  it('display the tracking first step', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingInit });

    render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('init-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('init-section')).toBeInTheDocument();
    });
  });

  it('display the tracking second step', async () => {
    (useQuery as Mock).mockReturnValue({
      data: trackingContactConfirmation,
    });

    render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('init-check')).toBeInTheDocument();
      expect(screen.getByTestId('contact-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  it('display the tracking third step', async () => {
    (useQuery as Mock).mockReturnValue({
      data: trackingCurrentRegistrarConfirmation,
    });

    render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('contact-check')).toBeInTheDocument();
      expect(screen.getByTestId('confirmation-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('confirmation-section')).toBeInTheDocument();
    });
  });

  it('display the tracking last step', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingFinalization });

    render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-check')).toBeInTheDocument();
      expect(screen.getByTestId('finalization-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('finalization-section')).toBeInTheDocument();
    });
  });

  it('display the tracking done', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingDone });

    render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('done')).toBeInTheDocument();
    });
  });

  it('display the tracking with error', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingAuthError });

    render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toBeInTheDocument();
    });
  });
});
