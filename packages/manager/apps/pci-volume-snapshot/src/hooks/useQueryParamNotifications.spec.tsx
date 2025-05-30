import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useSearchParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useQueryParamNotifications } from './useQueryParamNotifications';

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(),
  },
}));

describe('useQueryParamNotifications', () => {
  const addSuccessMock = vi.fn();
  const addErrorMock = vi.fn();
  const setSearchParamsMock = vi.fn();
  let searchParamsMock: URLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();

    searchParamsMock = new URLSearchParams();
    vi.mocked(useNotifications).mockReturnValue({
      addSuccess: addSuccessMock,
      addError: addErrorMock,
    });
    vi.mocked(useSearchParams).mockReturnValue([
      searchParamsMock,
      setSearchParamsMock,
    ]);
    vi.mocked(DOMPurify.sanitize).mockImplementation(
      (value) => `sanitized-${value}`,
    );
  });

  it('should do nothing when no notification params are in the URL', () => {
    renderHook(() => useQueryParamNotifications());

    expect(addSuccessMock).not.toHaveBeenCalled();
    expect(addErrorMock).not.toHaveBeenCalled();
    expect(setSearchParamsMock).not.toHaveBeenCalled();
  });

  it('should show success notification and remove params when notificationType=success', () => {
    searchParamsMock = new URLSearchParams(
      '?notificationType=success&notificationMsg=test-message',
    );
    vi.mocked(useSearchParams).mockReturnValue([
      searchParamsMock,
      setSearchParamsMock,
    ]);

    renderHook(() => useQueryParamNotifications());

    expect(DOMPurify.sanitize).toHaveBeenCalledWith('test-message');
    expect(addSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          dangerouslySetInnerHTML: {
            __html: 'sanitized-test-message',
          },
        },
      }),
    );

    expect(setSearchParamsMock).toHaveBeenCalledWith(expect.any(Function), {
      replace: true,
    });

    // Verify the function passed to setSearchParams removes the parameters
    const prevParams = new URLSearchParams(
      '?notificationType=success&notificationMsg=test-message',
    );
    const updateFn = setSearchParamsMock.mock.calls[0][0];
    updateFn(prevParams);

    expect(prevParams.has('notificationType')).toBe(false);
    expect(prevParams.has('notificationMsg')).toBe(false);
  });

  it('should show error notification and remove params when notificationType=error', () => {
    searchParamsMock = new URLSearchParams(
      '?notificationType=error&notificationMsg=error-message',
    );
    vi.mocked(useSearchParams).mockReturnValue([
      searchParamsMock,
      setSearchParamsMock,
    ]);

    renderHook(() => useQueryParamNotifications());

    expect(DOMPurify.sanitize).toHaveBeenCalledWith('error-message');
    expect(addErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          dangerouslySetInnerHTML: {
            __html: 'sanitized-error-message',
          },
        },
      }),
    );

    expect(setSearchParamsMock).toHaveBeenCalledWith(expect.any(Function), {
      replace: true,
    });

    // Verify the function passed to setSearchParams removes the parameters
    const prevParams = new URLSearchParams(
      '?notificationType=error&notificationMsg=error-message',
    );
    const updateFn = setSearchParamsMock.mock.calls[0][0];
    updateFn(prevParams);

    expect(prevParams.has('notificationType')).toBe(false);
    expect(prevParams.has('notificationMsg')).toBe(false);
  });

  it('should properly sanitize HTML content in notification messages', () => {
    const htmlMessage = '<p>Test with <b>bold</b> text</p>';
    searchParamsMock = new URLSearchParams(
      `?notificationType=success&notificationMsg=${encodeURIComponent(
        htmlMessage,
      )}`,
    );
    vi.mocked(useSearchParams).mockReturnValue([
      searchParamsMock,
      setSearchParamsMock,
    ]);

    vi.mocked(DOMPurify.sanitize).mockReturnValue('<p>Sanitized HTML</p>');

    renderHook(() => useQueryParamNotifications());

    expect(DOMPurify.sanitize).toHaveBeenCalledWith(htmlMessage);
    expect(addSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          dangerouslySetInnerHTML: {
            __html: '<p>Sanitized HTML</p>',
          },
        },
      }),
    );
  });
});
