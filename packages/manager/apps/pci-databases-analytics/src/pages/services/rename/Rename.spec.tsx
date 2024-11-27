import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import RenameModal from './Rename.modal'; // Adjust the path as needed
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';

vi.mock('../[serviceId]/_components/RenameService.component', () => ({
  default: vi.fn(() => <div data-testid="rename-service-modal" />),
}));
describe('Services list rename modal', () => {
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

  it('should render rename modal', async () => {
    render(<RenameModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('rename-service-modal')).toBeInTheDocument();
    });
  });
});
