import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/dashboard/home/Home.page';
import { Locale } from '@/hooks/useLocale.hook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { mockedApp } from '@/__tests__/helpers/mocks/app';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { mockedJob } from '@/__tests__/helpers/mocks/job';
import { mockedCurrentUsage } from '@/__tests__/helpers/mocks/currentUsage';

describe('Home page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/app.api', () => ({
      getApps: vi.fn(() => [mockedApp]),
    }));
    vi.mock('@/data/api/ai/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
    }));
    vi.mock('@/data/api/ai/job.api', () => ({
      getJobs: vi.fn(() => [mockedJob]),
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
        notebooks: [mockedNotebook],
        apps: [mockedApp],
        jobs: [mockedJob],
      })),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegion]),
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
  it('renders and shows Home Page', async () => {
    render(<Home />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('product-life-card')).toBeInTheDocument();
    });
  });
});
