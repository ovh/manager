import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import { useToast } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import * as integrationsApi from '@/data/api/database/integration.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DeleteIntegration from './DeleteIntegration.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import {
  mockedCapabilitiesIntegrations,
  mockedIntegrations,
} from '@/__tests__/helpers/mocks/integrations';

vi.mock('@/data/api/database/integration.api', () => ({
  getServiceIntegrations: vi.fn(() => [mockedIntegrations]),
  getServiceCapabilitiesIntegrations: vi.fn(() => [
    mockedCapabilitiesIntegrations,
  ]),
  addIntegration: vi.fn(),
  deleteIntegration: vi.fn(),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

describe('Delete integration modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      integrationId: mockedIntegrations.id,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should open the modal', async () => {
    render(<DeleteIntegration />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-integrations-modal'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('delete-integrations-submit-button'),
      ).toBeInTheDocument();
    });
  });
  it('should delete an integration on submit', async () => {
    render(<DeleteIntegration />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-submit-button'));
    });
    await waitFor(() => {
      expect(integrationsApi.deleteIntegration).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteIntegrationToastSuccessTitle',
        description: 'deleteIntegrationToastSuccessDescription',
      });
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(integrationsApi.deleteIntegration).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteIntegration />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-submit-button'));
    });
    await waitFor(() => {
      expect(integrationsApi.deleteIntegration).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteIntegrationToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
