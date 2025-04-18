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
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as database from '@/types/cloud/project/database';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import * as patternApi from '@/data/api/database/pattern.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { mockedPattern } from '@/__tests__/helpers/mocks/patterns';
import AddPattern from './AddPattern.modal';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  engine: database.EngineEnum.opensearch,
  capabilities: {
    patterns: {
      create: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('Add Pattern modal', () => {
  beforeEach(async () => {
    vi.mock('react-i18next', async (importOriginal) => {
      const mod = await importOriginal<typeof import('react-i18next')>();
      return {
        ...mod,
        useTranslation: () => ({
          t: (key: string) => key,
        }),
      };
    });

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
        }),
      };
    });

    vi.mock('@/data/api/database/pattern.api', () => ({
      getPatterns: vi.fn(() => [mockedPattern]),
      addPattern: vi.fn((pattern) => pattern),
      deletePattern: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add pattern modal', async () => {
    render(<AddPattern />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-pattern-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-pattern-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-pattern-modal')).not.toBeInTheDocument();
    });
  });

  it('display error on delete pattenr error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'addPatternToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(patternApi.addPattern).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<AddPattern />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('add-pattern-pattern-input'), {
        target: {
          value: 'newpattern',
        },
      });
      fireEvent.change(screen.getByTestId('add-pattern-maxIndexCount-input'), {
        target: {
          value: 44,
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-pattern-submit-button'));
    });
    await waitFor(() => {
      expect(patternApi.addPattern).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete pattern success', async () => {
    render(<AddPattern />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('add-pattern-pattern-input'), {
        target: {
          value: 'newpattern',
        },
      });
      fireEvent.change(screen.getByTestId('add-pattern-maxIndexCount-input'), {
        target: {
          value: 44,
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-pattern-submit-button'));
    });
    await waitFor(() => {
      expect(patternApi.addPattern).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addPatternToastSuccessTitle',
        description: 'addPatternToastSuccessDescription',
      });
    });
  });
});
