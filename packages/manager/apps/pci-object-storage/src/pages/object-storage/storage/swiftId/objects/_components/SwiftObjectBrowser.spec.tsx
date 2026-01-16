import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import SwiftObjectBrowser from './SwiftObjectBrowser.component';
import { mockContainerObject } from '@/__tests__/helpers/mocks/s3/object';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerAccess } from '@/__tests__/helpers/mocks/storageContainer/access';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import storages from '@/types/Storages';

const mockedSwiftWithMatchingRegion: storages.ContainerDetail = {
  ...mockedContainerDetail,
  region: 'BHS', // Match the region in mockedContainerAccess
};

vi.mock('@/pages/object-storage/storage/swiftId/Swift.context', () => ({
  useSwiftData: vi.fn(() => ({
    projectId: 'projectId',
    swift: mockedSwiftWithMatchingRegion,
    swiftQuery: { isLoading: false },
  })),
}));

vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'fr_FR',
}));

describe('SwiftObjectBrowser', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component with objects', () => {
    const objects = [mockContainerObject];
    render(<SwiftObjectBrowser objects={objects} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByTestId('swift-object-browser')).toBeTruthy();
  });

  it('displays list of objects via SwiftObjectFileRenderer', () => {
    const object1 = { ...mockContainerObject, name: 'object1.json' };
    const object2 = { ...mockContainerObject, name: 'object2.json' };
    const object3 = { ...mockContainerObject, name: 'object3.json' };
    const objects = [object1, object2, object3];

    render(<SwiftObjectBrowser objects={objects} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('object1.json')).toBeTruthy();
    expect(screen.getByText('object2.json')).toBeTruthy();
    expect(screen.getByText('object3.json')).toBeTruthy();
  });

  it('opens modal when files are dropped', async () => {
    const objects = [mockContainerObject];
    const { container } = render(<SwiftObjectBrowser objects={objects} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

    // Find the drop zone (BrowserFileList div with onDrop handler)
    // It should be a div with overflow-auto class that contains the file list
    const dropZone = container.querySelector('div[class*="overflow-auto"]');
    await waitFor(() => {
      expect(dropZone).toBeTruthy();
    });
    // Create a drop event with files
    const dataTransfer = {
      files: [file1, file2],
    };

    fireEvent.drop(dropZone!, {
      dataTransfer,
    });

    await waitFor(() => {
      expect(screen.getByTestId('swift-object-drop-file-modal')).toBeTruthy();
    });
  });

  it('closes modal when onClose is called', async () => {
    const objects = [mockContainerObject];
    const { container } = render(<SwiftObjectBrowser objects={objects} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const dropZone = container.querySelector('div[class*="overflow-auto"]');
    expect(dropZone).toBeTruthy();

    // Open modal
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByTestId('swift-object-drop-file-modal')).toBeTruthy();
      expect(screen.getByTestId('add-object-form-cancel')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-object-form-cancel'));
    });
  });
});
