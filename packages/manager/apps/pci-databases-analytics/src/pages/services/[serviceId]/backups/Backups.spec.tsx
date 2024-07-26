import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import { breadcrumb as Breadcrumb } from '@/pages/services/[serviceId]/backups/Backups.layout';
import Backups from '@/pages/services/[serviceId]/backups/Backups.page';
import * as backupsApi from '@/data/api/database/backup.api';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  id: 'serviceId-8794-81981-48984-18654-467',
  engine: database.EngineEnum.postgresql,
  capabilities: {
    fork: {
      create: database.service.capability.StateEnum.enabled,
    },
    backupRestore: {
      create: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('Backups page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/backup.api', () => ({
      getServiceBackups: vi.fn(() => [mockedBackup]),
      restoreBackup: vi.fn((backup) => backup),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
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

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders and shows skeletons while loading', async () => {
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('skeleton-container-backup'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows backup table and button', async () => {
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedBackup.description)).toBeInTheDocument();
      expect(screen.getByTestId('backups-table')).toBeInTheDocument();
      expect(screen.getByTestId('fork-button')).toBeInTheDocument();
      expect(screen.getByTestId('restore-backup-button')).toBeInTheDocument();
    });
  });

  it('does not display restore button and fork button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {},
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('fork-button')).toBeNull();
    expect(screen.queryByTestId('restore-backup-button')).toBeNull();
  });

  it('disable restore button and fork button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          fork: {
            create: database.service.capability.StateEnum.disabled,
          },
          backupRestore: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    const restoreButton = screen.queryByTestId('restore-backup-button');
    expect(restoreButton).toBeInTheDocument();
    expect(restoreButton).toBeDisabled();
  });
});

describe('Open restore modals', () => {
  vi.mock('@/components/ui/use-toast', () => {
    const toastMock = vi.fn();
    return {
      useToast: vi.fn(() => ({
        toast: toastMock,
      })),
    };
  });
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('backups-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const actionButton = screen.getByTestId(buttonId);
    await waitFor(() => {
      expect(actionButton).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(actionButton);
    });
  };
  beforeEach(async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedBackup.description)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close restore modal from restore button', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('restore-backup-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('restore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('restore-modal'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(screen.queryByTestId('restore-modal')).not.toBeInTheDocument();
    });
  });
  it('restore from backup on restore success', async () => {
    await openButtonInMenu('backups-action-restore-button');
    await waitFor(() => {
      expect(screen.getByTestId('restore-modal')).toBeInTheDocument();
      expect(screen.getByTestId('restore-submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('restore-submit-button')).not.toBeDisabled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('restore-submit-button'));
    });
    await waitFor(() => {
      expect(backupsApi.restoreBackup).toHaveBeenCalled();
    });
  });

  it('restore from now on restore success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('restore-backup-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('restore-modal')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('restore-modal-radio-now'));
      fireEvent.click(screen.getByTestId('restore-submit-button'));
    });
    await waitFor(() => {
      expect(backupsApi.restoreBackup).toHaveBeenCalled();
    });
  });
  it('restore from pitr on restore success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('restore-backup-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('restore-modal')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('restore-modal-radio-pitr'));
      fireEvent.click(screen.getByTestId('restore-submit-button'));
    });
    await waitFor(() => {
      expect(backupsApi.restoreBackup).toHaveBeenCalled();
    });
  });
});
