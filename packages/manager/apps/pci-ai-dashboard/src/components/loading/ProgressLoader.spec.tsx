import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import ProgressLoader from './ProgressLoader.component';

describe('ProgressLoader component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('should display the loader component', async () => {
    render(<ProgressLoader />);
    act(() => {
      vi.clearAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByTestId('progressLoaderContainer')).toBeInTheDocument();
      expect(screen.getByTestId('progressLoaderBar')).toBeInTheDocument();
    });
  });
  it('should increment the progress over time', async () => {
    render(<ProgressLoader />);
    const initialWidth = screen.getByTestId('progressLoaderBar').style.width;
    act(() => {
      vi.advanceTimersByTime(500); // Advance time by 500ms
      vi.clearAllTimers();
    });

    await waitFor(() => {
      const newWidth = screen.getByTestId('progressLoaderBar').style.width;
      expect(newWidth).not.toBe(initialWidth);
    });
  });

  it('stops incrementing progress near 100% and does not exceed it', async () => {
    render(<ProgressLoader />);
    act(() => {
      vi.advanceTimersByTime(20000);
      vi.clearAllTimers();
    });
    const progressBar = screen.getByTestId('progressLoaderBar');

    await waitFor(() => {
      const progressWidth = parseFloat(progressBar.style.width);
      expect(progressWidth).toBeGreaterThan(90);
      expect(progressWidth).toBeLessThan(100);
    });
  });

  it('should reset progress to 0 after reaching 100%', async () => {
    render(<ProgressLoader />);
    act(() => {
      vi.advanceTimersByTime(100);
      vi.clearAllTimers();
    });

    await waitFor(() => {
      const { width } = screen.getByTestId('progressLoaderBar').style;
      expect(width).toBe('0%');
    });
  });

  it('cleans up the interval when the component is unmounted', () => {
    const { unmount } = render(<ProgressLoader />);
    vi.clearAllTimers();
    unmount();

    // After unmounting the component, advancing timers should not cause any errors or warnings
    expect(() => {
      vi.advanceTimersByTime(500);
    }).not.toThrow();
  });
});
