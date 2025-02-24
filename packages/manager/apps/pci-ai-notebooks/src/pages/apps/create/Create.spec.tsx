import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import {
  mockedCapabilitiesRegionBHS,
  mockedCapabilitiesRegionGRA,
} from '@/__tests__/helpers/mocks/region';

import {
  mockedSshKey,
  mockedSshKeyBis,
} from '@/__tests__/helpers/mocks/sshkey';
import { mockedCommand } from '@/__tests__/helpers/mocks/command';
import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/flavor';
import {
  mockedDatastoreWithContainerGit,
  mockedDatastoreWithContainerS3,
} from '@/__tests__/helpers/mocks/datastore';
import * as jobApi from '@/data/api/ai/job/job.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedJobSuggetions } from '@/__tests__/helpers/mocks/suggestion';
import Job, { breadcrumb as Breadcrumb } from './Create.page';
import {
  mockedPresetImage,
  mockedPresetImageBis,
} from '@/__tests__/helpers/mocks/presetImage';

const mockedUsedNavigate = vi.fn();
describe('Order funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
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

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
        useNavigate: () => mockedUsedNavigate,
      };
    });

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => mockedPciProject),
      };
    });

    vi.mock('@/data/api/ai/job/job.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
      addJob: vi.fn((job) => job),
    }));

    vi.mock('@/data/api/ai/job/suggestions.api', () => ({
      getSuggestions: vi.fn(() => mockedJobSuggetions),
    }));

    vi.mock('@/data/api/ai/job/capabilities/image.api', () => ({
      getPresetImage: vi.fn(() => [mockedPresetImage, mockedPresetImageBis]),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [
        mockedCapabilitiesRegionGRA,
        mockedCapabilitiesRegionBHS,
      ]),
      getFlavor: vi.fn(() => [mockedCapabilitiesFlavorCPU]),
    }));

    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [
        mockedDatastoreWithContainerGit,
        mockedDatastoreWithContainerS3,
      ]),
    }));

    vi.mock('@/data/api/sshkey/sshkey.api', () => ({
      getSshkey: vi.fn(() => [mockedSshKey, mockedSshKeyBis]),
    }));

    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  // it('renders the skeleton component while loading', async () => {
  //   render(<Job />, { wrapper: RouterWithQueryClientWrapper });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
  //   });
  // });

  // it('renders the order funnel', async () => {
  //   render(<Job />, { wrapper: RouterWithQueryClientWrapper });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
  //     expect(screen.getByTestId('name-section')).toBeInTheDocument();
  //     expect(screen.getByTestId('flavor-section')).toBeInTheDocument();
  //     expect(screen.getByTestId('region-section')).toBeInTheDocument();
  //     expect(screen.getByTestId('image-section')).toBeInTheDocument();
  //     expect(screen.getByTestId('advance-config-section')).toBeInTheDocument();
  //     expect(screen.getByTestId('order-submit-button')).toBeInTheDocument();
  //   });
  // });

  // it('trigger toast error on getCommand API Error', async () => {
  //   vi.mocked(jobApi.getCommand).mockImplementation(() => {
  //     throw apiErrorMock;
  //   });
  //   render(<Job />, { wrapper: RouterWithQueryClientWrapper });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('advanced-config-button'));
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('cli-command-button'));
  //   });
  //   await waitFor(() => {
  //     expect(jobApi.getCommand).toHaveBeenCalled();
  //     expect(useToast().toast).toHaveBeenCalledWith({
  //       title: 'errorGetCommandCli',
  //       description: apiErrorMock.response.data.message,
  //       variant: 'destructive',
  //     });
  //   });
  // });

  // it('trigger getCommand on Cli Command button click', async () => {
  //   render(<Job />, { wrapper: RouterWithQueryClientWrapper });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('cli-command-button'));
  //   });
  //   await waitFor(() => {
  //     expect(jobApi.getCommand).toHaveBeenCalled();
  //   });
  // });

  // it('trigger toast error on add Job API Error', async () => {
  //   vi.mocked(jobApi.addJob).mockImplementation(() => {
  //     throw apiErrorMock;
  //   });
  //   render(<Job />, { wrapper: RouterWithQueryClientWrapper });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('order-submit-button'));
  //   });
  //   await waitFor(() => {
  //     expect(jobApi.addJob).toHaveBeenCalled();
  //     expect(useToast().toast).toHaveBeenCalledWith({
  //       title: 'errorCreatingJob',
  //       description: apiErrorMock.response.data.message,
  //       variant: 'destructive',
  //     });
  //   });
  // });

  // it('trigger add Job on click', async () => {
  //   render(<Job />, { wrapper: RouterWithQueryClientWrapper });
  //   await waitFor(() => {
  //     expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('order-submit-button'));
  //   });
  //   await waitFor(() => {
  //     expect(jobApi.addJob).toHaveBeenCalled();
  //   });
  //   expect(mockedUsedNavigate).toHaveBeenCalledWith('../training/undefined');
  // });
});
