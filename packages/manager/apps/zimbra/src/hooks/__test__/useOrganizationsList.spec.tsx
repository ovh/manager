import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { organizationListMock } from '@/api/_mock_';
import { useOrganizationList } from '../useOrganizationsList';
import { wrapper } from '@/utils/test.provider';

describe('useOrganizationsList', () => {
  it('should return a list of organization', async () => {
    const { result } = renderHook(() => useOrganizationList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(organizationListMock);
  });
});
