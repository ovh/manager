import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import DeleteSwiftModal from './Delete.modal';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'test-project-id',
      swiftId: 'test-swift-id',
    }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../Swift.context', () => ({
  useSwiftData: () => ({ swift: mockedContainerDetail }),
}));

const mockDeleteSwift = vi.fn();
let mockOnDeleteSuccess: () => void;

vi.mock('@/data/hooks/swift-storage/useDeleteSwift.hook', () => ({
  useDeleteSwift: ({ onDeleteSuccess }: { onDeleteSuccess: () => void }) => {
    mockOnDeleteSuccess = onDeleteSuccess;
    return {
      deleteSwift: mockDeleteSwift,
      isPending: false,
    };
  },
}));

describe('DeleteSwiftModal', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockDeleteSwift.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have disabled submit button until TERMINATE is typed', () => {
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByTestId('delete-storage-submit-button')).toBeDisabled();

    const input = screen.getByTestId('delete-storage-confirmation-input');
    fireEvent.change(input, { target: { value: 'TERMINATE' } });

    expect(
      screen.getByTestId('delete-storage-submit-button'),
    ).not.toBeDisabled();
  });

  it('should call deleteSwift with correct payload when submitted', () => {
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByTestId('delete-storage-confirmation-input');
    fireEvent.change(input, { target: { value: 'TERMINATE' } });
    fireEvent.click(screen.getByTestId('delete-storage-submit-button'));

    expect(mockDeleteSwift).toHaveBeenCalledWith({
      projectId: 'test-project-id',
      containerId: 'test-swift-id',
    });
  });

  it('should navigate to parent route on delete success', () => {
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });

    mockOnDeleteSuccess();

    expect(mockNavigate).toHaveBeenCalledWith('../../');
  });
});
