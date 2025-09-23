import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { useInstancesCatalog } from '../useInstancesCatalog';
import {
  mockedInstancesCatalogDTO,
  mockedProjectId,
  mockedInstancesCatalogEntity,
} from '@/__mocks__/instance/constants';

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

afterEach(() => {
  vi.clearAllMocks();
});

describe('useInstancesCatalog', () => {
  it('Should return expected instances catalog data', async () => {
    vi.spyOn(v6, 'get').mockResolvedValueOnce({
      data: mockedInstancesCatalogDTO,
    });

    const { result } = renderHook(() => useInstancesCatalog(), { wrapper });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${mockedProjectId}/catalog/instance`,
    );
    expect(result.current.isPending).toBeTruthy();
    await waitFor(() =>
      expect(result.current.data).toStrictEqual(mockedInstancesCatalogEntity),
    );
  });
});
