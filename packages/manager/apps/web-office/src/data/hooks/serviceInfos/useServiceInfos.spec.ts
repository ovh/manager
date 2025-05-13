import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import {
  mockOfficeLicenseServiceInfos,
  licensesMock,
} from '@/data/api/__mocks__';
import { useServiceInfos } from '../serviceInfos/useServiceInfos';
import { wrapper } from '@/utils/test.provider';

describe('useServiceInfos', () => {
  it('should return office service infos', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });
    const { result } = renderHook(() => useServiceInfos(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toEqual(true);
    });
    expect(result.current.data).toEqual(mockOfficeLicenseServiceInfos);
  });
});
