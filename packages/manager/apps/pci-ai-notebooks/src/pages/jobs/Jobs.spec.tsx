import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedJob } from '@/__tests__/helpers/mocks/job';
import Jobs from './Jobs.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

const mockedUsedNavigate = vi.fn();
describe('Jobs List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
    }));

    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJobs: vi.fn(() => [mockedJob]),
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

  it('should display Jobs pages and skeleton', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('jobs-list-table-skeleton')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeInTheDocument();
    });
  });

  it('should display jobs list table and add button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-job-button')).toBeInTheDocument();
      expect(screen.getByText(mockedJob.id)).toBeInTheDocument();
      expect(screen.getByText(mockedJob.spec.name)).toBeInTheDocument();
    });
  });

  it('open start job modal from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeInTheDocument();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-restart-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./restart/jobId');
  });

  it('open kill job modal from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeInTheDocument();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-stop-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./stop/jobId');
  });

  it('open delete notebook Modal from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeInTheDocument();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-delete-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/jobId');
  });

  it('go to manage job from action table button', async () => {
    render(<Jobs />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.id)).toBeInTheDocument();
    });
    await openButtonInMenu('jobs-action-trigger', 'job-action-manage-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./jobId');
  });
});
