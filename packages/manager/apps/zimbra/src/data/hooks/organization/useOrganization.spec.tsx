import { useSearchParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { organizationMock } from '@/data/api';
import { useOrganization } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOrganization', () => {
  it('should return detail of organization in params url', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        organizationId: organizationMock.id,
      }),
      vi.fn(),
    ]);

    const { result } = renderHook(() => useOrganization(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(organizationMock);
  });
});
