import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as database from '@/types/cloud/project/database';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import * as patternApi from '@/data/api/database/pattern.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { mockedPattern } from '@/__tests__/helpers/mocks/patterns';
import DeletePatternModal from './DeletePattern.modal';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  engine: database.EngineEnum.opensearch,
  capabilities: {
    patterns: {
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('DeletePattern modal', () => {
  beforeEach(async () => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@datatr-ux/uxlib', async () => {
      const mod = await vi.importActual('@datatr-ux/uxlib');
      const toastMock = vi.fn();
      return {
        ...mod,
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: database.engine.CategoryEnum.analysis,
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          patternId: 'patternId',
        }),
      };
    });

    vi.mock('@/data/api/database/pattern.api', () => ({
      getPatterns: vi.fn(() => [mockedPattern]),
      deletePattern: vi.fn(),
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

  it('renders skeleton while loading', async () => {
    render(<DeletePatternModal />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  it('open and close delete delete pattern modal', async () => {
    render(<DeletePatternModal />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-patterns-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-patterns-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-patterns-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('display error on delete pattenr error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deletePatternToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(patternApi.deletePattern).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<DeletePatternModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-patterns-submit-button'));
    });
    await waitFor(() => {
      expect(patternApi.deletePattern).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete pattern success', async () => {
    render(<DeletePatternModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-patterns-submit-button'));
    });
    await waitFor(() => {
      expect(patternApi.deletePattern).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deletePatternToastSuccessTitle',
        description: 'deletePatternToastSuccessDescription',
      });
    });
  });
});
