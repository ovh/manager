import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedGuide,
  mockedGuideOnboarding,
} from '@/__tests__/helpers/mocks/guides';
import OnboardingAnalytics from './OnboardingAnalytics.component';
import OnboardingDatabases from './OnboardingDatabases.component';

describe('Onboarding page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', async (importOriginal) => {
      const mod = await importOriginal<typeof import('react-i18next')>();
      return {
        ...mod,
        useTranslation: () => ({
          t: (key: string) => key,
        }),
      };
    });
    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
      };
    });

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('@/data/api/guides/guides.api', () => ({
      getGuides: vi.fn(() => [mockedGuide, mockedGuideOnboarding]),
    }));
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
