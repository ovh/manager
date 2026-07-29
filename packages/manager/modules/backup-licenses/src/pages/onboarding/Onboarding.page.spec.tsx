import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import OnboardingPage from './Onboarding.page';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

describe('OnboardingPage', () => {
  it('navigates to the order funnel stub route when clicking the CTA', async () => {
    await renderWithProviders(<OnboardingPage />);

    await userEvent.click(screen.getByTestId('manager-button'));

    expect(navigateMock).toHaveBeenCalledWith('/order');
  });
});
