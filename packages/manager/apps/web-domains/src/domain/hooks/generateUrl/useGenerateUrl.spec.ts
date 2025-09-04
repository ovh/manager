import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useGenerateUrl } from './useGenerateUrl';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('react-router-dom', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useHref: vi.fn(
      (text) => `#/web-domains/domain/example.com/${text.slice(2)}`,
    ),
  };
});

describe('useGenerateUrl', () => {
  it('should return url href', async () => {
    const { result } = renderHook(() => useGenerateUrl('./add', 'href'), {
      wrapper,
    });
    expect(result.current).toBe('#/web-domains/domain/example.com/add');
  });

  it('should return url href with params', async () => {
    const { result } = renderHook(
      () =>
        useGenerateUrl('./delete', 'href', {
          zoneName: 'example.com',
        }),
      {
        wrapper,
      },
    );
    expect(result.current).toBe(
      '#/web-domains/domain/example.com/delete?zoneName=example.com',
    );
  });

  it('should return url path', async () => {
    const { result } = renderHook(() => useGenerateUrl('./add', 'path'), {
      wrapper,
    });
    expect(result.current).toBe('./add');
  });

  it('should return url path with params', async () => {
    const { result } = renderHook(
      () =>
        useGenerateUrl('./delete', 'path', {
          zoneName: 'example.com',
        }),
      {
        wrapper,
      },
    );
    expect(result.current).toBe('./delete?zoneName=example.com');
  });
});
