import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initiateTextFileDownload } from './download';

// Define types for our mocks
interface MockLink extends HTMLAnchorElement {
  click: () => void;
}

describe('initiateTextFileDownload', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let appendChildMock: ReturnType<typeof vi.fn>;
  let removeChildMock: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock URL.createObjectURL
    createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    vi.stubGlobal('URL', { createObjectURL: createObjectURLMock });

    // Mock document.body.appendChild and removeChild
    appendChildMock = vi.fn();
    removeChildMock = vi.fn();
    vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildMock);
    vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildMock);

    // Mock link.click
    clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation(
      () =>
        (({
          click: clickMock,
        } as unknown) as HTMLElement),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a Blob with the correct content and type', () => {
    const filename = 'test.txt';
    const text = 'Hello, World!';

    const mockBlob = vi.fn().mockImplementation((content, options) => ({
      content,
      options,
    }));
    vi.stubGlobal('Blob', mockBlob);

    initiateTextFileDownload({ filename, text });

    expect(mockBlob).toHaveBeenCalledWith([text], { type: 'text/plain' });
  });

  it('should create a download link with correct attributes', () => {
    const filename = 'test.txt';
    const text = 'Hello, World!';

    initiateTextFileDownload({ filename, text });

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(appendChildMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();

    const createdLink = appendChildMock.mock.calls[0][0] as MockLink;
    expect(createdLink.href).toBe('blob:mock-url');
    expect(createdLink.download).toBe(filename);
  });

  it('should clean up after initiating the download', () => {
    const filename = 'test.txt';
    const text = 'Hello, World!';

    initiateTextFileDownload({ filename, text });

    expect(removeChildMock).toHaveBeenCalled();
  });
});
