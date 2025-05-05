import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
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
    (useQuery as jest.Mock).mockReturnValue({ data: trackingInit });

    const { getByTestId } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('init-spinner')).toBeInTheDocument();
      expect(getByTestId('init-section')).toBeInTheDocument();
    });
  });

  it('display the tracking second step', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: trackingContactConfirmation,
    });

    const { getByTestId } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('init-check')).toBeInTheDocument();
      expect(getByTestId('contact-spinner')).toBeInTheDocument();
      expect(getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  it('display the tracking third step', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: trackingCurrentRegistrarConfirmation,
    });

    const { getByTestId } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('contact-check')).toBeInTheDocument();
      expect(getByTestId('confirmation-spinner')).toBeInTheDocument();
      expect(getByTestId('confirmation-section')).toBeInTheDocument();
    });
  });

  it('display the tracking last step', async () => {
    (useQuery as jest.Mock).mockReturnValue({ data: trackingFinalization });

    const { getByTestId } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('confirmation-check')).toBeInTheDocument();
      expect(getByTestId('finalization-spinner')).toBeInTheDocument();
      expect(getByTestId('finalization-section')).toBeInTheDocument();
    });
  });

  it('display the tracking done', async () => {
    (useQuery as jest.Mock).mockReturnValue({ data: trackingDone });

    const { getByTestId } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('done')).toBeInTheDocument();
    });
  });

  it('display the tracking with error', async () => {
    (useQuery as jest.Mock).mockReturnValue({ data: trackingAuthError });

    const { getByTestId } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('auth-error')).toBeInTheDocument();
    });
  });
});
