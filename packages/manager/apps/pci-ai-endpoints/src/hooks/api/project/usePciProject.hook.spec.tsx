import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/data/api/project/project.api';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import { wrapper } from '@/wrapperRenders';

describe('usePciProject', () => {
  it('should return PciProject data', async () => {
    const mockProjectData = {
      id: '123',
      name: 'Project A',
      description: 'description',
    };

    vi.spyOn(API, 'getProject').mockResolvedValue(mockProjectData);

    const { result } = renderHook(() => usePciProject(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockProjectData);
    });
  });
});
