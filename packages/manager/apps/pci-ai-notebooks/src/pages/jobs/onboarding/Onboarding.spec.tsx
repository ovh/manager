import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Onboarding from './Onboarding.page';
import { Locale } from '@/hooks/useLocale';
import { mockedUser } from '@/__tests__/helpers/mocks/userOVH';
import {
  mockedGuideOnboarding,
  mockedGuides,
} from '@/__tests__/helpers/mocks/guides';

const mockedUsedNavigate = vi.fn();
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
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

    vi.mock('@/data/api/ai/guide.api', () => ({
      getGuides: vi.fn(() => [mockedGuides, mockedGuideOnboarding]),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the onboarding Page', async () => {
    render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onbaording-container')).toBeInTheDocument();
      expect(screen.getByTestId('create-job-link')).toBeInTheDocument();
      expect(screen.getByTestId('guide-open-button')).toBeInTheDocument();
    });
  });
});
