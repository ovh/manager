import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedGuide,
  mockedGuideOnboarding,
} from '@/__tests__/helpers/mocks/guides';
import OnboardingAnalytics from './OnboardingAnalytics.component';
import OnboardingDatabases from './OnboardingDatabases.component';

vi.mock('@/data/api/guides/guides.api', () => ({
  getGuides: vi.fn(() => [mockedGuide, mockedGuideOnboarding]),
}));

describe('Onboarding page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the onBoarding Analytics Page', async () => {
    render(<OnboardingAnalytics />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-container')).toBeInTheDocument();
      expect(screen.getByTestId('guide-open-button')).toBeInTheDocument();
      expect(
        screen.getByTestId('create-analytic-service-link'),
      ).toBeInTheDocument();
    });
  });
  it('renders the onBoarding Databases Page', async () => {
    render(<OnboardingDatabases />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-container')).toBeInTheDocument();
      expect(screen.getByTestId('guide-open-button')).toBeInTheDocument();
      expect(
        screen.getByTestId('create-database-service-link'),
      ).toBeInTheDocument();
    });
  });
});
