import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { organizationsMock } from '@/data/api';
import { useOrganizations } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOrganizations', () => {
  it('should return a list of organization', async () => {
    const { result } = renderHook(() => useOrganizations(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(organizationsMock);
  });
});
