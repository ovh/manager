import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { checkHasActiveBackupLicensesSubscription } from './checkHasActiveBackupLicensesSubscription';
import { useHasActiveBackupLicensesSubscription } from './useHasActiveBackupLicensesSubscription';

vi.mock('./checkHasActiveBackupLicensesSubscription');

const mockedCheck = vi.mocked(checkHasActiveBackupLicensesSubscription);

const renderWithQueryClient = () => {
  const queryClient = new QueryClient();
  return renderHook(() => useHasActiveBackupLicensesSubscription(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('useHasActiveBackupLicensesSubscription', () => {
  it('resolves to true when a subscription is active', async () => {
    mockedCheck.mockResolvedValue(true);

    const { result } = renderWithQueryClient();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(true);
  });

  it('resolves to false when no subscription is active', async () => {
    mockedCheck.mockResolvedValue(false);

    const { result } = renderWithQueryClient();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(false);
  });
});
