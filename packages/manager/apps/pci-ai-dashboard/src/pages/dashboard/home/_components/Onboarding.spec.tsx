import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/dashboard/home/Home.page';
import { Locale } from '@/hooks/useLocale.hook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCurrentUsage } from '@/__tests__/helpers/mocks/currentUsage';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/authorization';

describe('Home page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/app.api', () => ({
      getApps: vi.fn(() => []),
    }));
    vi.mock('@/data/api/ai/notebook.api', () => ({
      getNotebooks: vi.fn(() => []),
    }));
    vi.mock('@/data/api/ai/job.api', () => ({
      getJobs: vi.fn(() => []),
    }));

    vi.mock('@/data/api/usage/usage.api', () => ({
      getCurrentUsage: vi.fn(() => mockedCurrentUsage),
    }));
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    vi.mock('@/pages/dashboard/Dashboard.context', () => ({
      useDashboardData: vi.fn(() => ({
        projectId: 'projectId',
        notebooks: [],
        apps: [],
        jobs: [],
      })),
    }));

    vi.mock('@/data/api/ai/authorization.api', () => ({
      getAuthorization: vi.fn(() => [mockedAuthorization]),
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
  it('renders and shows Home Page with Onboarding', async () => {
    render(<Home />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-card')).toBeInTheDocument();
    });
  });
});
