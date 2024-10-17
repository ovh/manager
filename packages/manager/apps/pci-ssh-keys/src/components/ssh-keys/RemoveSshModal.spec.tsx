import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { UseMutationResult } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { wrapper } from '@/setupTests';
import * as useSShModule from '@/api/hooks/useSsh';
import RemoveSshModal from './RemoveSshModal';

type UseRemoveSshKeyReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { remove: () => void };

const remove = vi.fn(() => {});

function renderModal() {
  return render(
    <RemoveSshModal
      projectId="foo"
      sshId="test"
      onClose={() => {}}
      onError={() => {}}
      onSuccess={() => {}}
    ></RemoveSshModal>,
    { wrapper },
  );
}

vi.mock('@/api/hooks/useSsh', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useSshKey: vi.fn(() => ({ data: null, isPending: false })),
  };
});

describe('Add ssh modal', async () => {
  it('should call the add function with given voucher id', async () => {
    vi.spyOn(useSShModule, 'useRemoveSsh').mockReturnValue(({
      remove,
    } as unknown) as UseRemoveSshKeyReturnType);
    const { getByTestId } = renderModal();
    const submitButton = getByTestId('submitButton');
    expect(remove).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(remove).toHaveBeenCalled();
    });
  });
});
