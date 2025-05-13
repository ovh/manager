import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DeleteModal from './Delete.modal'; // Adjust the path as needed
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';

vi.mock('../[serviceId]/_components/DeleteService.component', () => ({
  default: vi.fn(() => <div data-testid="delete-service-modal" />),
}));
describe('Services list delete modal', () => {
  beforeEach(() => {
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render delete modal', async () => {
    render(<DeleteModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-service-modal')).toBeInTheDocument();
    });
  });
});
