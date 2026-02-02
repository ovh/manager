import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useGetProject } from '@/hooks/useGetProject';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: () => ({ data: { project_id: '1a2b3c', description: 'projectName' } }),
}));

vi.mock('@/hooks/useNavigation', () => ({
  useNavigation: () => ({
    getURL: () => Promise.resolve('http://public-cloud/#/pci/projects/'),
  }),
}));

describe('useGetProject', () => {
  it('should get project id, name and url', async () => {
    const { result } = renderHook(() => useGetProject());

    await waitFor(() => {
      expect(result.current).toEqual({
        id: '1a2b3c',
        name: 'projectName',
        url: 'http://public-cloud/#/pci/projects/',
      });
    });
  });
});
