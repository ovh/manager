import * as reactRouterDom from 'react-router-dom';

import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGenerateUrl } from '../../generateUrl/useGenerateUrl';

vi.mock('@/utils', () => ({
  buildURLWithSearchParams: vi.fn(({ baseURL, searchParams }) => {
    const params = new URLSearchParams();
    Object.entries(searchParams as Record<string, string>).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
    return `${baseURL}?${params.toString()}`;
  }),
}));

describe('useGenerateUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(reactRouterDom.useSearchParams).mockReturnValue([
      new URLSearchParams('serviceName=test-service'),
    ] as unknown as ReturnType<typeof reactRouterDom.useSearchParams>);
    vi.mocked(reactRouterDom.useHref).mockReturnValue('/test-path?serviceName=test-service');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return path when type is path', () => {
    const { result } = renderHook(() => useGenerateUrl('/test-path', 'path'));

    expect(result.current).toContain('/test-path');
    expect(result.current).toContain('serviceName=test-service');
  });

  it('should return href when type is href', () => {
    const { result } = renderHook(() => useGenerateUrl('/test-path', 'href'));

    expect(result.current).toBe('/test-path?serviceName=test-service');
  });

  it('should default to path type', () => {
    const { result } = renderHook(() => useGenerateUrl('/test-path'));

    expect(result.current).toContain('/test-path');
  });

  it('should include additional params', () => {
    const { result } = renderHook(() =>
      useGenerateUrl('/test-path', 'path', { domain: 'example.com', id: 123 }),
    );

    expect(result.current).toContain('serviceName=test-service');
    expect(result.current).toContain('domain=example.com');
    expect(result.current).toContain('id=123');
  });

  it('should use serviceName from searchParams when available', () => {
    vi.mocked(reactRouterDom.useSearchParams).mockReturnValue([
      new URLSearchParams('serviceName=existing-service'),
    ] as unknown as ReturnType<typeof reactRouterDom.useSearchParams>);

    const { result } = renderHook(() =>
      useGenerateUrl('/test-path', 'path', { domain: 'example.com' }),
    );

    expect(result.current).toContain('serviceName=existing-service');
  });

  it('should use default relativeType', () => {
    const useHrefSpy = vi.mocked(reactRouterDom.useHref);
    renderHook(() => useGenerateUrl('/test-path', 'href'));

    expect(useHrefSpy).toHaveBeenCalledWith(expect.any(String), { relative: 'path' });
  });

  it('should use custom relativeType', () => {
    const useHrefSpy = vi.mocked(reactRouterDom.useHref);
    renderHook(() => useGenerateUrl('/test-path', 'href', undefined, 'route'));

    expect(useHrefSpy).toHaveBeenCalledWith(expect.any(String), { relative: 'route' });
  });
});
