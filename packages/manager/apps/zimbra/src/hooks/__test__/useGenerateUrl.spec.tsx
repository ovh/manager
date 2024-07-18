import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useGenerateUrl } from '../useGenerateUrl';

vi.mock('@/hooks', () => {
  return {
    useOrganization: vi.fn(() => ({ data: undefined })),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useHref: vi.fn(
      (text) =>
        `#/00000000-0000-0000-0000-000000000001/organizations/${text.slice(2)}`,
    ),
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('href', () => {
  it('Return url href', async () => {
    const { result } = renderHook(() => useGenerateUrl('./add', 'href'), {
      wrapper,
    });
    expect(result.current).toBe(
      '#/00000000-0000-0000-0000-000000000001/organizations/add?',
    );
  });

  it('Return url href with params', async () => {
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

  it('Return url path', async () => {
    const { result } = renderHook(() => useGenerateUrl('./add', 'path'), {
      wrapper,
    });
    expect(result.current).toBe('./add?');
  });

  it('Return url path with params', async () => {
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
