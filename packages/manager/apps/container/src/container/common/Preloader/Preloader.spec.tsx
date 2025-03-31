import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import OvhCloudPreloader from './OvhCloudPreloader';
import usePreloader from './usePreloader';

let showCallback: () => void;
let hideCallback: () => void;
let mockPlugin: {
  onShowPreloader: Mock;
  onHidePreloader: Mock;
  removeOnShowPreloader: Mock;
  removeOnHidePreloader: Mock;
  showPreloader: Mock;
};
let mockShell: { getPlugin: Mock };
let mockIframe: HTMLIFrameElement;

describe('Preloader', () => {
  beforeEach(() => {
    mockPlugin = {
      onShowPreloader: vi.fn((cb) => {
        showCallback = cb;
      }),
      onHidePreloader: vi.fn((cb) => {
        hideCallback = cb;
      }),
      removeOnShowPreloader: vi.fn(),
      removeOnHidePreloader: vi.fn(),
      showPreloader: vi.fn(),
    };

    mockShell = {
      getPlugin: vi.fn(() => mockPlugin),
    };

    mockIframe = document.createElement('iframe');
  });
  describe('Preloader.component', () => {
    it('should render welcome message initially', () => {
      const { getByText } = render(<OvhCloudPreloader visible={false} />);
      expect(getByText('welcome_title')).toBeInTheDocument();
    });

    it('should switch to loading message', async () => {
      const { rerender } = render(<OvhCloudPreloader visible={false} />);
      expect(screen.getByText('welcome_title')).toBeInTheDocument();

      // First time visible becomes true
      rerender(<OvhCloudPreloader visible={false} />);
      rerender(<OvhCloudPreloader visible={true} />);
      expect(screen.getByText('welcome_title')).toBeInTheDocument();

      // Toggle visible again to trigger the second change
      rerender(<OvhCloudPreloader visible={false} />);
      rerender(<OvhCloudPreloader visible={true} />);

      await act(async () => {
        await new Promise(requestAnimationFrame);
      });

      expect(screen.getByText('loading')).toBeInTheDocument();
    });
  });

  describe('usePreloader.hook', () => {
    it('should handle show/hide preloader events', async () => {
      const { result } = renderHook(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usePreloader(mockShell as any, mockIframe),
      );

      expect(result.current).toBe(false);

      await act(async () => {
        mockIframe.dispatchEvent(new Event('load'));
        await new Promise(requestAnimationFrame);
      });

      expect(mockShell.getPlugin).toHaveBeenCalledWith('ux');
      expect(mockPlugin.showPreloader).toHaveBeenCalled();

      await act(async () => {
        showCallback();
        await new Promise(requestAnimationFrame);
      });
      expect(result.current).toBe(true);

      await act(async () => {
        hideCallback();
        await new Promise(requestAnimationFrame);
      });
      expect(result.current).toBe(false);
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usePreloader(mockShell as any, mockIframe),
      );

      unmount();

      expect(mockPlugin.removeOnShowPreloader).toHaveBeenCalled();
      expect(mockPlugin.removeOnHidePreloader).toHaveBeenCalled();
    });
  });
});
