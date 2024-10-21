import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';

import { useUpdateAdmissionPlugin } from './useAdmissionPlugin';
import { wrapper } from '@/wrapperRenders';
import { TClusterCustomization } from '@/types';

const customization = {
  apiServer: {
    admissionPlugins: { enabled: ['Plugin1'], disabled: ['Plugin2'] },
  },
};

describe('useUpdateAdmissionPlugin', () => {
  it('updates admission plugin successfully', async () => {
    vi.spyOn(v6, 'put').mockReturnValue(new Promise((res, rej) => res('ok')));
    const mockSuccess = vi.fn();
    const mockError = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdateAdmissionPlugin({
          projectId: 'project1',
          kubeId: 'kube1',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );

    result.current.updateAdmissionPlugins(
      customization as TClusterCustomization,
    );

    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });

  it('handles error when updating admission plugin', async () => {
    vi.spyOn(v6, 'put').mockReturnValue(
      new Promise((res, rej) => res && rej(new Error('Network Error'))),
    );
    const mockSuccess = vi.fn();
    const mockError = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdateAdmissionPlugin({
          projectId: 'project1',
          kubeId: 'kube1',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );

    result.current.updateAdmissionPlugins(customization);

    await waitFor(() =>
      expect(mockError).toHaveBeenCalledWith(
        new Error('Network Error'),
        customization,
        undefined,
      ),
    );
    expect(mockSuccess).not.toHaveBeenCalled();
  });
});
