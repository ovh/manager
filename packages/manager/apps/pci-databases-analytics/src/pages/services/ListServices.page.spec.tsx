import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUsedNavigate, setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import ListServices, { Loader } from '@/pages/services/ListServices.page';
import * as database from '@/types/cloud/project/database';
import * as serviceApi from '@/data/api/database/service.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

const ServiceProps = {
  params: {
    projectId: 'projectId',
    category: 'operational',
  },
  request: new Request('https://my-api.com/endpoint'),
};

vi.mock('@/data/api/database/service.api', () => ({
  getServices: vi.fn(() => [mockedService]),
  editService: vi.fn((service) => service),
  deleteService: vi.fn(),
}));


describe('Services List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
    });
  });

  it('should display services pages and skeleton', async () => {
    vi.mocked(serviceApi.editService).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<ListServices />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('datatable.skeleton')).toBeInTheDocument();
    });
  });

  it('should display services list table and add button', async () => {
    render(<ListServices />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-service-button')).toBeInTheDocument();
      expect(screen.getByText(mockedService.id)).toBeInTheDocument();
      expect(screen.getByText(mockedService.description)).toBeInTheDocument();
    });
  });

  it('fetches services data from loader', async () => {
    Loader(ServiceProps);
    await waitFor(() => {
      expect(serviceApi.getServices).toHaveBeenCalled();
    });
  });
});

describe('Open modals', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('services-action-trigger');
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
    render(<ListServices />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedService.id)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open rename service modal', async () => {
    await openButtonInMenu('service-action-rename-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./rename/serviceId');
    });
  });

  it('open delete service Modal', async () => {
    await openButtonInMenu('service-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/serviceId');
    });
  });
});
