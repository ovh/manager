import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as labelApi from '@/data/api/ai/app/label/label.api';
import { useEditLabel } from './useEditLabel.hook';
import { mockedLabel } from '@/__tests__/helpers/mocks/label';

vi.mock('@/data/api/ai/app/label/label.api', () => ({
  editLabel: vi.fn(),
}));

describe('useEditLabel', () => {
  it('should call useEditLabel on mutation with data', async () => {
    const projectId = 'projectId';
    const appId = 'appId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(labelApi.editLabel).mockResolvedValue(mockedLabel);
    const { result } = renderHook(() => useEditLabel({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const editLabelProps = {
      projectId,
      appId,
      label: mockedLabel,
    };
    result.current.editLabel(editLabelProps);

    await waitFor(() => {
      expect(labelApi.editLabel).toHaveBeenCalledWith(editLabelProps);
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
