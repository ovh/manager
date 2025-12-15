import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedSwift } from '@/__tests__/helpers/mocks/swift';
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
  useSwiftData: () => ({ swift: mockedSwift }),
}));

vi.mock('@/types/Storages', () => ({
  default: {},
  ObjectStorageTypeEnum: { swift: 'swift', s3: 's3' },
}));

const mockDeleteStorage = vi.fn();
let mockOnDeleteSuccess: () => void;

vi.mock('@/data/hooks/storage/useDeleteStorage.hook', () => ({
  useDeleteStorage: ({ onDeleteSuccess }: { onDeleteSuccess: () => void }) => {
    mockOnDeleteSuccess = onDeleteSuccess;
    return {
      deleteStorage: mockDeleteStorage,
      isPending: false,
    };
  },
}));

describe('DeleteSwiftModal', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockDeleteStorage.mockClear();
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

  it('should call deleteStorage with correct payload when submitted', () => {
    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByTestId('delete-storage-confirmation-input');
    fireEvent.change(input, { target: { value: 'TERMINATE' } });
    fireEvent.click(screen.getByTestId('delete-storage-submit-button'));

    expect(mockDeleteStorage).toHaveBeenCalledWith({
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
