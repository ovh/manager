import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InstallationStepSummary from './InstallationStepSummary.page';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import { testIds } from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({ stepId: '1' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

const renderComponent = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InstallationFormContextProvider>
        <InstallationStepSummary />
      </InstallationFormContextProvider>
    </QueryClientProvider>,
  );

describe('InstallationStepSummary page unit test suite', () => {
  it('should render field with correct title and CTA', () => {
    renderComponent();

    expect(screen.getByText('summary_title')).toBeVisible();

    const submitCta = screen.getByTestId(testIds.formSubmitCta);
    expect(submitCta).toBeVisible();
    expect(submitCta).toHaveAttribute('label', 'summary_cta_submit');
  });
});

describe('Tracking test suite', () => {
  it('should track summary confirmation', async () => {
    renderComponent();
    const user = userEvent.setup();
    const submitCta = screen.getByTestId(testIds.formSubmitCta);
    await act(() => user.click(submitCta));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.installation.submitSummary('confirm'),
    );
  });

  it('should track summary previous action', async () => {
    renderComponent();
    const user = userEvent.setup();
    const previousCta = screen.getByTestId(testIds.formPreviousCta);
    await act(() => user.click(previousCta));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.installation.submitSummary('previous'),
    );
  });
});
