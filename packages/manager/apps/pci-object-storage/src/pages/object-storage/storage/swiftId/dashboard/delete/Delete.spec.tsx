import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import {
  mockedUsedNavigate,
  setMockedUseParams,
  resetMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import DeleteSwiftModal from './Delete.modal';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  deleteSwiftStorage: vi.fn(),
}));

vi.mock('../../Swift.context', () => ({
  useSwiftData: () => ({ swift: mockedContainerDetail }),
}));

describe('DeleteSwiftModal', () => {
  beforeEach(() => {
    setMockedUseParams({ swiftId: 'test-swift-id' });
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetMockedUseParams();
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

  it('should call deleteSwiftStorage API with correct payload when submitted', async () => {
    vi.mocked(swiftStorageApi.deleteSwiftStorage).mockResolvedValue(undefined);

    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByTestId('delete-storage-confirmation-input');
    fireEvent.change(input, { target: { value: 'TERMINATE' } });
    fireEvent.click(screen.getByTestId('delete-storage-submit-button'));

    await waitFor(() => {
      expect(swiftStorageApi.deleteSwiftStorage).toHaveBeenCalledWith({
        projectId: 'projectId',
        containerId: 'test-swift-id',
      });
    });
  });

  it('should navigate to parent route on delete success', async () => {
    vi.mocked(swiftStorageApi.deleteSwiftStorage).mockResolvedValue(undefined);

    render(<DeleteSwiftModal />, { wrapper: RouterWithQueryClientWrapper });

    const input = screen.getByTestId('delete-storage-confirmation-input');
    fireEvent.change(input, { target: { value: 'TERMINATE' } });
    fireEvent.click(screen.getByTestId('delete-storage-submit-button'));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../../');
    });
  });
});
