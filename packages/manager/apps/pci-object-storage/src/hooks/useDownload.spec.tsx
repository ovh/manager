import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import useDownload from './useDownload.hook';

describe('useDownload', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a blob from raw data and trigger a download', async () => {
    const createdURL = 'fileUrl';
    const data = 'Test data';
    const filename = 'test.txt';

    global.URL.createObjectURL = vi.fn(() => createdURL);
    global.URL.revokeObjectURL = vi.fn();

    const { result } = renderHook(() => useDownload());

    act(() => {
      document.createElement = vi.fn(
        (tagName: string): HTMLElement => {
          if (tagName === 'a') {
            return ({
              href: '',
              download: '',
              click: vi.fn(),
            } as unknown) as HTMLAnchorElement;
          }
          return document.createElement(tagName);
        },
      );
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      result.current.download({ type: 'raw', data }, filename);
    });

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      const anchorElement = (document.createElement as Mock).mock.results[0]
        .value as HTMLAnchorElement;
      expect(anchorElement.href).toBe(createdURL);
      expect(anchorElement.download).toBe(filename);
      expect(anchorElement.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(createdURL);
    });
  });
});
