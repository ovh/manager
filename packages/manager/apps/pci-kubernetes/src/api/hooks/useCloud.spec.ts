import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as ApiCloudModule from '@/api/data/cloud';
import { TCloudSchema } from '@/api/data/cloud';
import { useGetCloudSchema } from '@/api/hooks/useCloud';
import { wrapper } from '@/wrapperRenders';

describe('useGetCloudSchema', () => {
  it('fetches cloud schema successfully', async () => {
    const mockData = { schema: 'mockSchema' } as unknown as TCloudSchema;
    vi.spyOn(ApiCloudModule, 'getCloudSchema').mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useGetCloudSchema(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
