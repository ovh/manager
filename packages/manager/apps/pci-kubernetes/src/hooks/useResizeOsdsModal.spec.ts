import { renderHook } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { useResponsiveModal } from './useResizeOsdsModal';

describe('useResponsiveModal', () => {
  let addEventListenerMock;
  let removeEventListenerMock;
  let querySelectorMock;
  let innerWidthMock;

  beforeEach(() => {
    addEventListenerMock = vi.spyOn(window, 'addEventListener');
    removeEventListenerMock = vi.spyOn(window, 'removeEventListener');
    querySelectorMock = vi.spyOn(document, 'querySelector');
    innerWidthMock = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800); // Mock window.innerWidth to be greater than BreakPoints.SM
  });

  afterEach(() => {
    addEventListenerMock.mockRestore();
    removeEventListenerMock.mockRestore();
    querySelectorMock.mockRestore();
    innerWidthMock.mockRestore();
  });

  it('applies styles to the popup element when it exists', () => {
    const size = '500px';

    // Create the necessary DOM structure
    const popupElement = document.createElement('div');
    popupElement.classList.add('popup');
    const dialogElement = document.createElement('dialog');
    const divElement1 = document.createElement('div');
    divElement1.appendChild(popupElement);

    dialogElement.appendChild(divElement1);
    const shadowRoot = document.createElement('div');
    shadowRoot.appendChild(dialogElement);
    const modalElement = document.createElement('osds-modal');
    modalElement.attachShadow({ mode: 'open' });
    modalElement.shadowRoot.appendChild(shadowRoot);
    document.body.appendChild(modalElement);

    querySelectorMock.mockReturnValue(modalElement);

    renderHook(() => useResponsiveModal(size));

    expect(popupElement.style.maxWidth).toBe(size);
    expect(popupElement.style.minWidth).toBe('auto');
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });

  it('does not apply styles if the popup element does not exist', () => {
    const size = '500px';
    querySelectorMock.mockReturnValue(null);

    renderHook(() => useResponsiveModal(size));

    expect(addEventListenerMock).not.toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const size = '500px';

    // Create the necessary DOM structure
    const popupElement = document.createElement('div');
    popupElement.classList.add('popup');
    const dialogElement = document.createElement('dialog');
    const divElement1 = document.createElement('div');
    const divElement2 = document.createElement('div');
    divElement2.appendChild(popupElement);
    divElement1.appendChild(divElement2);
    dialogElement.appendChild(divElement1);
    const shadowRoot = document.createElement('div');
    shadowRoot.appendChild(dialogElement);
    const modalElement = document.createElement('osds-modal');
    modalElement.attachShadow({ mode: 'open' });
    modalElement.shadowRoot.appendChild(shadowRoot);
    document.body.appendChild(modalElement);

    querySelectorMock.mockReturnValue(modalElement);

    const { unmount } = renderHook(() => useResponsiveModal(size));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});
