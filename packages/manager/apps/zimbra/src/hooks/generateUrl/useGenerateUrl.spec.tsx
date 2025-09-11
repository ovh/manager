import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { useGenerateUrl } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

vi.mock('react-router-dom', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useHref: vi.fn(
      (text: string) => `#/00000000-0000-0000-0000-000000000001/organizations/${text.slice(2)}`,
    ),
  };
});

describe('useGenerateUrl', () => {
  it('should return url href', () => {
    const { result } = renderHook(() => useGenerateUrl('./add', 'href'), {
      wrapper,
    });
    expect(result.current).toBe('#/00000000-0000-0000-0000-000000000001/organizations/add');
  });

  it('should return url href with params', () => {
    const { result } = renderHook(
      () =>
        useGenerateUrl('./delete', 'href', {
          deleteOrganizationId: '5859f8b7-3ebf-4cd5-a483-68b7fc48ce56',
        }),
      {
        wrapper,
      },
    );
    expect(result.current).toBe(
      '#/00000000-0000-0000-0000-000000000001/organizations/delete?deleteOrganizationId=5859f8b7-3ebf-4cd5-a483-68b7fc48ce56',
    );
  });

  it('should return url path', () => {
    const { result } = renderHook(() => useGenerateUrl('./add', 'path'), {
      wrapper,
    });
    expect(result.current).toBe('./add');
  });

  it('should return url path with params', () => {
    const { result } = renderHook(
      () =>
        useGenerateUrl('./delete', 'path', {
          deleteOrganizationId: '5859f8b7-3ebf-4cd5-a483-68b7fc48ce56',
        }),
      {
        wrapper,
      },
    );
    expect(result.current).toBe(
      './delete?deleteOrganizationId=5859f8b7-3ebf-4cd5-a483-68b7fc48ce56',
    );
  });
});
