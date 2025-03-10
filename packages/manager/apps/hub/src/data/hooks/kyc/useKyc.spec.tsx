import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { v6 as Api } from '@ovh-ux/manager-core-api';
import { useKyc } from '@/data/hooks/kyc/useKyc';
import { KycProcedures } from '@/types/kyc.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useKyc', () => {
  it('should return an helper to make kyc request', async () => {
    const { result } = renderHook(() => useKyc(KycProcedures.INDIA), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.useKycStatus).not.toBeNull();
    });
  });

  it('should make a call to the correct API given a kyc procedure name', async () => {
    const apiGet = vi
      .spyOn(Api, 'get')
      .mockReturnValue(Promise.resolve({ status: 'required' }));

    renderHook(() => useKyc(KycProcedures.INDIA).useKycStatus(), {
      wrapper,
    });

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith('/me/procedure/identity');
    });
  });
});
