import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as partnerApi from '@/data/api/ai/partner/partner.api';
import { mockedContract } from '@/__tests__/helpers/mocks/partner/partner';
import { useSignPartnerContract } from './useSignPartnerContract.hook';
import { PartnerApp } from '@/data/api/ai/partner/partner.api';

vi.mock('@/data/api/ai/partner/partner.api', () => ({
  signPartnerContract: vi.fn(),
}));

describe('useSignContract', () => {
  it('should sign partner contract', async () => {
    const projectId = 'projectId';
    const region = 'regionId';
    const partnerId = 'partnerId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(partnerApi.signPartnerContract).mockResolvedValue(mockedContract);

    const { result } = renderHook(
      () => useSignPartnerContract({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const signContractProps: PartnerApp = {
      projectId,
      region,
      partnerId,
    };

    result.current.signPartnerContract(signContractProps);

    await waitFor(() => {
      expect(partnerApi.signPartnerContract).toHaveBeenCalledWith(
        signContractProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(mockedContract);
    });
  });
});
