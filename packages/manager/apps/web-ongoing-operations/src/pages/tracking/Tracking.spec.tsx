import '@/setupTests';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';
import { Mock, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TrackingTranfert from '@/pages/tracking/Tracking';
import { wrapper } from '@/utils/test.provider';

const trackingA11yRules = {
  'heading-order': { enabled: false },
};

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

    const { container } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('init-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('init-section')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible({ rules: trackingA11yRules });
  });

  it('display the tracking second step', async () => {
    (useQuery as Mock).mockReturnValue({
      data: trackingContactConfirmation,
    });

    const { container } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('init-check')).toBeInTheDocument();
      expect(screen.getByTestId('contact-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible({ rules: trackingA11yRules });
  });

  it('display the tracking third step', async () => {
    (useQuery as Mock).mockReturnValue({
      data: trackingCurrentRegistrarConfirmation,
    });

    const { container } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('contact-check')).toBeInTheDocument();
      expect(screen.getByTestId('confirmation-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('confirmation-section')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible({ rules: trackingA11yRules });
  });

  it('display the tracking last step', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingFinalization });

    const { container } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-check')).toBeInTheDocument();
      expect(screen.getByTestId('finalization-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('finalization-section')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible({
      rules: {
        ...trackingA11yRules,
        'button-name': { enabled: false },
      },
    });
  });

  it('display the tracking done', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingDone });

    const { container } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('done')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible();
  });

  it('display the tracking with error', async () => {
    (useQuery as Mock).mockReturnValue({ data: trackingAuthError });

    const { container } = render(<TrackingTranfert />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible({ rules: trackingA11yRules });
  });
});
