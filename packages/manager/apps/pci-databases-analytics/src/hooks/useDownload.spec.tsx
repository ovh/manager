import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import useDownload from '@/hooks/useDownload'; // Adjust the import path as necessary

describe('useDownload', () => {
  it('creates a blob from the data and triggers a download with the specified filename', async () => {
    const createdURL = 'fileUrl';
    const data = 'Test data';
    const filename = 'test.txt';

    // mock url functions
    global.URL.createObjectURL = vi.fn(() => createdURL);
    global.URL.revokeObjectURL = vi.fn();

    const { result } = renderHook(() => useDownload());

    // Simulate the download
    act(() => {
      // only mock the createElement function here to be able to render the hook
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
      result.current.download(data, filename);
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
