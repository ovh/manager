import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import StorageClassSelector from './StorageClassSelector.component';
import storages from '@/types/Storages';

const availableStorageClasses = [
  storages.StorageClassEnum.STANDARD,
  storages.StorageClassEnum.HIGH_PERF,
];

const onStorageClassChange = vi.fn();
describe('StorageClassSelector component', () => {
  it('renders Storage Class Selector component', async () => {
    render(
      <StorageClassSelector
        storageClass={storages.StorageClassEnum.STANDARD}
        onStorageClassChange={onStorageClassChange}
        availableStorageClasses={availableStorageClasses}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('storage-class-selector-container'),
      ).toBeTruthy();
      expect(screen.getByTestId('storage-class-radio-group')).toBeTruthy();
      expect(screen.getByTestId('radio-item-HIGH_PERF')).toBeTruthy();
    });
  });
  it('trigger and dispay popover content', async () => {
    render(
      <StorageClassSelector
        storageClass={storages.StorageClassEnum.STANDARD}
        onStorageClassChange={onStorageClassChange}
        availableStorageClasses={availableStorageClasses}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    expect(screen.queryByTestId('popover-content-container')).not.toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('storage-popover-trigger'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('popover-content-container')).toBeTruthy();
    });
  });

  it('trigger and display popover content', async () => {
    render(
      <StorageClassSelector
        storageClass={storages.StorageClassEnum.STANDARD}
        onStorageClassChange={onStorageClassChange}
        availableStorageClasses={availableStorageClasses}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    expect(screen.queryByTestId('popover-content-container')).not.toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('storage-popover-trigger'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('popover-content-container')).toBeTruthy();
    });
  });
});
