import { useParams } from 'react-router-dom';

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { licensesMock } from '@/data/api/__mocks__/license';
import { mockOfficeLicenseServiceInfos } from '@/data/api/__mocks__/serviceInfos';
import { wrapper } from '@/utils/Test.provider';

import { useServiceInfos } from '../useServiceInfos';

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
