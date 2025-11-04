import { vi } from 'vitest';

/**
 * Mock implementation of @tanstack/react-virtual `useVirtualizer`.
 * Simulates virtualization logic for predictable test behavior.
 */
export const useVirtualizer = vi.fn((options?: { count?: number; estimateSize?: () => number }) => {
  const count = options?.count ?? 0;
  const estimateSize = options?.estimateSize ?? (() => 50);

  // Build a fake list of virtual items
  const virtualItems = Array.from({ length: count }, (_, index) => {
    const size = estimateSize();
    const start = index * size;
    const end = start + size;
    return { index, start, size, end, key: index };
  });

  /** Mock API methods — keep them individually callable for assertions */
  const scrollToIndex = vi.fn();
  const measure = vi.fn();
  const getScrollElement = vi.fn(() => ({ scrollTop: 0 }));
  const getVirtualItems = vi.fn(() => virtualItems);
  const getTotalSize = vi.fn(() => virtualItems.reduce((acc, v) => acc + v.size, 0));

  return {
    getVirtualItems,
    getTotalSize,
    scrollToIndex,
    measure,
    getScrollElement,
  };
});
