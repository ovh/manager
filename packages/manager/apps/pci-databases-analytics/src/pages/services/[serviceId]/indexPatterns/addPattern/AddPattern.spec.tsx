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
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import { ReactNode } from 'react';

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

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: database.engine.CategoryEnum.analysis,
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

vi.mock('@/data/api/database/pattern.api', () => ({
  getPatterns: vi.fn(() => [mockedPattern]),
  addPattern: vi.fn((pattern) => pattern),
  deletePattern: vi.fn(),
}));


describe('Add Pattern modal', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
    });
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
      variant: 'critical',
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
