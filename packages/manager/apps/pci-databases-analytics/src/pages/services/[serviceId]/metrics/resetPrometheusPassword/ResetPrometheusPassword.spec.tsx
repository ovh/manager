import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as prometheusApi from '@/data/api/database/prometheus.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ResetPrometheusPassword from '@/pages/services/[serviceId]/metrics/resetPrometheusPassword/ResetPrometheusPassword.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import {
  mockedDatabaseUser,
  mockedDatabaseUserWithPassword,
} from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';

vi.mock('@/data/api/database/prometheus.api', () => ({
  getPrometheus: vi.fn(() => {}),
  resetPrometheusUserPassword: vi.fn(() => mockedDatabaseUserWithPassword),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

describe('Reset prometheus user password modal', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      userId: mockedDatabaseUser.id,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should open the modal', async () => {
    render(<ResetPrometheusPassword />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('reset-password-modal')).toBeInTheDocument();
    });
  });
  it('should reset a user password on submit', async () => {
    render(<ResetPrometheusPassword />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(prometheusApi.resetPrometheusUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(prometheusApi.resetPrometheusUserPassword).mockImplementationOnce(
      () => {
        throw apiErrorMock;
      },
    );
    render(<ResetPrometheusPassword />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(prometheusApi.resetPrometheusUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'resetUserPasswordToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
  it('should copy password to clipboard', async () => {
    render(<ResetPrometheusPassword />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('reset-password-copy-button'),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(prometheusApi.resetPrometheusUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
    });
  });
  it('should close modal on close button after submit', async () => {
    render(<ResetPrometheusPassword />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('reset-password-cancel-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-cancel-button'));
    });
    await waitFor(() => {
      expect(prometheusApi.resetPrometheusUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
    });
  });
});
