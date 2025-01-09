import { it, vi, describe } from 'vitest';
import { debounce } from '@/helpers';

vi.useFakeTimers();

describe('functionHelper', () => {
  describe('debounce', () => {
    it('should debounce a function', () => {
      const mockFunc = vi.fn();
      const debouncedFunc = debounce(mockFunc, 1000);

      debouncedFunc();
      debouncedFunc();
      vi.runAllTimers();
      expect(mockFunc).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);

      debouncedFunc();
      debouncedFunc();
      vi.runAllTimers();
      expect(mockFunc).toHaveBeenCalledTimes(2);
    });
  });
});
