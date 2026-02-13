import { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { VIRTUALIZED_BROWSER } from './virtualized-browser.constants';

interface VirtualizedBrowserProps<T> {
  items: T[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  maxHeight?: string;
  resetKey?: string | number; // Key to reset scroll position when changed
  overscan?: number; // Number of items to render outside the visible area
  rowHeight?: number; // Height of each row in pixels
  preloadThreshold?: number; // Number of items from the end to trigger preload
  onDropFiles?: (files: File[]) => void; // Callback when files are dropped
  isFetching?: boolean; // Whether the query is currently fetching (for initial loads/searches)
}

const VirtualizedBrowser = <T,>({
  items,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  renderItem,
  className,
  maxHeight = VIRTUALIZED_BROWSER.DEFAULT_MAX_HEIGHT,
  resetKey,
  overscan = VIRTUALIZED_BROWSER.DEFAULT_OVERSCAN,
  rowHeight = VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT,
  preloadThreshold = VIRTUALIZED_BROWSER.DEFAULT_PRELOAD_THRESHOLD,
  onDropFiles,
  isFetching = false,
}: VirtualizedBrowserProps<T>) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const parentRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const last = virtualItems.at(-1);

    if (!last || !hasNextPage || isFetchingNextPage) {
      return;
    }

    // Preload threshold reached - fetch next page
    if (last.index >= items.length - preloadThreshold) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    items.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    preloadThreshold,
  ]);

  useEffect(() => {
    if (!parentRef.current) return;

    // Reset scroll position when resetKey changes (e.g., folder navigation, search)
    parentRef.current.scrollTop = 0;
    virtualizer.scrollToIndex(0, { align: 'start' });
  }, [resetKey, virtualizer]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!onDropFiles) return;
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDropFiles(droppedFiles);
  };

  return (
    <div
      ref={parentRef}
      className={cn(className, 'relative')}
      style={{ maxHeight, overflowY: 'auto', position: 'relative' }}
      onDragOver={(e) => {
        if (onDropFiles) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (onDropFiles) {
          e.preventDefault();
          setIsDragOver(false);
        }
      }}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md text-primary pointer-events-none z-50">
          {t('dropFilesToUpload')}
        </div>
      )}
      <div
        style={{
          height:
            virtualizer.getTotalSize() +
            (isFetchingNextPage || (isFetching && items.length === 0)
              ? rowHeight
              : 0),
          position: 'relative',
        }}
      >
        {isFetching && items.length === 0 ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: rowHeight,
            }}
            className="flex items-center justify-center text-sm text-muted-foreground"
          >
            {t('loading')}
          </div>
        ) : (
          virtualItems.map((v) => {
            const item = items[v.index];

            return (
              <div
                className="border-b"
                key={v.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: rowHeight,
                  transform: `translateY(${v.start}px)`,
                }}
              >
                {renderItem(item, v.index)}
              </div>
            );
          })
        )}

        {isFetchingNextPage && items.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: virtualizer.getTotalSize(),
              left: 0,
              width: '100%',
              height: rowHeight,
            }}
            className="flex items-center justify-center text-sm text-muted-foreground"
          >
            {t('loading')}
          </div>
        )}
      </div>
    </div>
  );
};

export { VirtualizedBrowser };
