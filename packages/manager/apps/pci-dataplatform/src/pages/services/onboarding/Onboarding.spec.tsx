import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import Onboarding from '@/pages/services/onboarding/Onboarding.page';

import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedPciProject,
  mockedPciDiscoveryProject,
} from '@/__tests__/helpers/mocks/project';
import * as ProjectAPI from '@/data/project/project.api';

describe('Onboarding page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
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
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the onBoarding Page', async () => {
    render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('onboarding-container-test'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('onboarding-card')).toBeInTheDocument();
    });
  });

  it('renders discovery banner when it is discovery mode', async () => {
    vi.mocked(ProjectAPI.getProject).mockResolvedValue(
      mockedPciDiscoveryProject,
    );
    render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBeInTheDocument();
    });
  });

  it('does not render discovery banner when it is  not discovery mode', async () => {
    vi.mocked(ProjectAPI.getProject).mockResolvedValue(mockedPciProject);
    render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBe(null);
    });
  });
});
