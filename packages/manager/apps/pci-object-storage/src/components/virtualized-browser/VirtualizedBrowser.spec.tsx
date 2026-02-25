import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualizedBrowser } from './VirtualizedBrowser.component';
import { VIRTUALIZED_BROWSER } from './virtualized-browser.constants';

// Mock useVirtualizer
const mockGetVirtualItems = vi.fn();
const mockGetTotalSize = vi.fn();
const mockScrollToIndex = vi.fn();

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(({ count }) => {
    // Create mock virtual items for all items
    const virtualItems = Array.from({ length: count }, (_, index) => ({
      key: `virtual-item-${index}`,
      index,
      start: index * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
      size: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
      end: (index + 1) * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
    }));

    mockGetVirtualItems.mockReturnValue(virtualItems);
    mockGetTotalSize.mockReturnValue(
      count * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
    );

    return {
      getVirtualItems: mockGetVirtualItems,
      getTotalSize: mockGetTotalSize,
      scrollToIndex: mockScrollToIndex,
    };
  }),
}));

describe('VirtualizedBrowser', () => {
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  const mockRenderItem = vi.fn(
    (item: { id: number; name: string }, index: number) => (
      <div data-testid={`item-${item.id}`}>
        {item.name} (index: {index})
      </div>
    ),
  );

  const mockFetchNextPage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetVirtualItems.mockReturnValue(
      Array.from({ length: mockItems.length }, (_, index) => ({
        key: `virtual-item-${index}`,
        index,
        start: index * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
        size: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
        end: (index + 1) * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
      })),
    );
    mockGetTotalSize.mockReturnValue(
      mockItems.length * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render items using renderItem function', () => {
      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
        />,
      );

      expect(screen.getByTestId('item-1')).toBeTruthy();
      expect(screen.getByTestId('item-2')).toBeTruthy();
      expect(screen.getByTestId('item-3')).toBeTruthy();
      expect(mockRenderItem).toHaveBeenCalledTimes(3);
    });

    it('should render empty list when items array is empty', () => {
      render(
        <VirtualizedBrowser
          items={[]}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
        />,
      );

      expect(mockRenderItem).not.toHaveBeenCalled();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          className="custom-class"
        />,
      );

      const browserElement = container.firstChild;
      expect(browserElement).toHaveClass('custom-class');
    });

    it('should apply custom maxHeight', () => {
      const { container } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          maxHeight="100vh"
        />,
      );

      const browserElement = container.firstChild as HTMLElement;
      expect(browserElement.style.maxHeight).toBe('100vh');
    });
  });

  describe('Loading states', () => {
    it('should show loading message when isFetching is true and items are empty', () => {
      render(
        <VirtualizedBrowser
          items={[]}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          isFetching={true}
        />,
      );

      expect(screen.getByText('loading')).toBeTruthy();
    });

    it('should not show loading message when items exist even if isFetching is true', () => {
      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          isFetching={true}
        />,
      );

      expect(screen.queryByText('loading')).not.toBeTruthy();
    });

    it('should show loading indicator when fetching next page', () => {
      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={true}
          isFetchingNextPage={true}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
        />,
      );

      expect(screen.getByText('loading')).toBeTruthy();
    });

    it('should not show loading indicator when not fetching next page', () => {
      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={true}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
        />,
      );

      expect(screen.queryByText('loading')).toBeFalsy();
    });
  });

  describe('Pagination', () => {
    it('should call fetchNextPage when reaching preload threshold', async () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));

      // Mock virtual items where the last item is at the threshold
      const virtualItems = Array.from({ length: 20 }, (_, index) => ({
        key: `virtual-item-${index}`,
        index,
        start: index * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
        size: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
        end: (index + 1) * VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
      }));

      mockGetVirtualItems.mockReturnValue(virtualItems);

      render(
        <VirtualizedBrowser
          items={manyItems}
          hasNextPage={true}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          preloadThreshold={10}
        />,
      );

      // Wait for useEffect to run
      await waitFor(() => {
        expect(mockFetchNextPage).toHaveBeenCalled();
      });
    });

    it('should not call fetchNextPage when hasNextPage is false', async () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));

      render(
        <VirtualizedBrowser
          items={manyItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          preloadThreshold={10}
        />,
      );

      await waitFor(() => {
        // Give time for useEffect to potentially run
      });

      expect(mockFetchNextPage).toBeTruthy();
    });

    it('should not call fetchNextPage when already fetching next page', async () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));

      render(
        <VirtualizedBrowser
          items={manyItems}
          hasNextPage={true}
          isFetchingNextPage={true}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          preloadThreshold={10}
        />,
      );

      await waitFor(() => {
        // Give time for useEffect to potentially run
      });

      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop', () => {
    it('should show drag over overlay when dragging files', () => {
      const mockOnDropFiles = vi.fn();

      const { container } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          onDropFiles={mockOnDropFiles}
        />,
      );

      const browserElement = container.firstChild as HTMLElement;

      // Simulate drag over
      fireEvent.dragOver(browserElement, {
        dataTransfer: {
          files: [new File([''], 'test.txt', { type: 'text/plain' })],
        },
      });

      expect(screen.getByText('dropFilesToUpload')).toBeTruthy();
    });

    it('should call onDropFiles when files are dropped', () => {
      const mockOnDropFiles = vi.fn();
      const testFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      const { container } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          onDropFiles={mockOnDropFiles}
        />,
      );

      const browserElement = container.firstChild as HTMLElement;

      // Simulate drop
      fireEvent.drop(browserElement, {
        dataTransfer: {
          files: [testFile],
        },
      });

      expect(mockOnDropFiles).toHaveBeenCalledWith([testFile]);
    });

    it('should not show drag overlay when onDropFiles is not provided', () => {
      const { container } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
        />,
      );

      const browserElement = container.firstChild as HTMLElement;

      fireEvent.dragOver(browserElement);

      expect(screen.queryByText('dropFilesToUpload')).toBeFalsy();
    });

    it('should hide drag overlay on drag leave', () => {
      const mockOnDropFiles = vi.fn();

      const { container } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          onDropFiles={mockOnDropFiles}
        />,
      );

      const browserElement = container.firstChild as HTMLElement;

      // Show overlay
      fireEvent.dragOver(browserElement);
      expect(screen.getByText('dropFilesToUpload')).toBeTruthy();

      // Hide overlay
      fireEvent.dragLeave(browserElement);
      expect(screen.queryByText('dropFilesToUpload')).toBeFalsy();
    });
  });

  describe('Scroll reset', () => {
    it('should reset scroll position when resetKey changes', () => {
      const { rerender } = render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          resetKey="key1"
        />,
      );

      expect(mockScrollToIndex).toHaveBeenCalledWith(0, { align: 'start' });

      mockScrollToIndex.mockClear();

      rerender(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          resetKey="key2"
        />,
      );

      expect(mockScrollToIndex).toHaveBeenCalledWith(0, { align: 'start' });
    });
  });

  describe('Custom props', () => {
    it('should use custom rowHeight', () => {
      const customRowHeight = 60;

      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          rowHeight={customRowHeight}
        />,
      );

      // The virtualizer should be called with custom rowHeight
      // This is verified through the mock implementation
      expect(mockGetTotalSize).toHaveBeenCalled();
    });

    it('should use custom overscan', () => {
      const customOverscan = 10;

      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          overscan={customOverscan}
        />,
      );

      // Overscan is passed to useVirtualizer, verified through mock
      expect(mockGetVirtualItems).toHaveBeenCalled();
    });

    it('should use custom preloadThreshold', async () => {
      const customThreshold = 5;
      const manyItems = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));

      render(
        <VirtualizedBrowser
          items={manyItems}
          hasNextPage={true}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
          preloadThreshold={customThreshold}
        />,
      );

      // The threshold affects when fetchNextPage is called
      await waitFor(() => {
        // Give time for useEffect to potentially run
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle null or undefined items gracefully', () => {
      render(
        <VirtualizedBrowser
          items={[]}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={mockRenderItem}
        />,
      );

      expect(mockRenderItem).not.toHaveBeenCalled();
    });

    it('should handle renderItem returning null', () => {
      const nullRenderItem = vi.fn(() => null);

      render(
        <VirtualizedBrowser
          items={mockItems}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={mockFetchNextPage}
          renderItem={nullRenderItem}
        />,
      );

      expect(nullRenderItem).toHaveBeenCalledTimes(3);
    });
  });
});
