import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InstallationStepSummary from './InstallationStepSummary.page';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';
import { testIds } from '@/utils/testIds.constants';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ stepId: '1' }),
}));

const queryClient = new QueryClient();

describe('InstallationStepSummary page unit test suite', () => {
  it('should render field with correct title and CTA', () => {
    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <InstallationFormContextProvider>
          <InstallationStepSummary />
        </InstallationFormContextProvider>
      </QueryClientProvider>,
    );

    expect(getByText('summary_title')).toBeVisible();

    const submitCta = getByTestId(testIds.formSubmitCta);
    expect(submitCta).toBeVisible();
    expect(submitCta).toHaveAttribute('label', 'summary_cta_submit');
  });
});
