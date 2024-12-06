import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UseMutationResult } from '@tanstack/react-query';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import AddSshModal from '@/components/ssh-keys/AddSshModal';
import { wrapper } from '@/setupTests';
import * as useSShModule from '@/api/hooks/useSsh';

const add = vi.fn(() => {});

function renderModal() {
  return render(
    <AddSshModal
      projectId="foo"
      onClose={() => {}}
      onError={() => {}}
      onSuccess={() => {}}
    ></AddSshModal>,
    { wrapper },
  );
}

type UseAddSshKeyReturnType = UseMutationResult<
  never,
  Error,
  { name: string; publicKey: string },
  unknown
> & { add: () => void };

describe('Add ssh modal', () => {
  it('should call the add function with given voucher id', async () => {
    vi.spyOn(useSShModule, 'useAddSsh').mockReturnValue(({
      add,
    } as unknown) as UseAddSshKeyReturnType);
    const { getByTestId } = renderModal();
    const keyNameInput = getByTestId('sshKeyName');
    const publicKeyInput = getByTestId('sshPublicKey');
    const submitButton = getByTestId('pciModal-button_submit');
    expect(add).not.toHaveBeenCalled();
    act(() => {
      fireEvent.change(keyNameInput, {
        target: {
          value: 'name of ssh key',
        },
      });
      fireEvent.change(publicKeyInput, {
        target: {
          value: 'public ssh key',
        },
      });
      // it seems we have to manually trigger the ods event
      ((keyNameInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'name of ssh key',
      } as OdsInputValueChangeEventDetail);
      ((publicKeyInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'public ssh key',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((keyNameInput as unknown) as OsdsInput).value).toBe(
      'name of ssh key',
    );
    expect(((publicKeyInput as unknown) as OsdsInput).value).toBe(
      'public ssh key',
    );
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(add).toHaveBeenCalledWith({
        name: 'name of ssh key',
        publicKey: 'public ssh key',
      });
    });
  });
  it('should disable submit button if no key is specified', async () => {
    const { getByTestId } = renderModal();
    const keyNameInput = getByTestId('sshKeyName');
    const publicKeyInput = getByTestId('sshPublicKey');
    const submitButton = getByTestId('pciModal-button_submit');
    act(() => {
      fireEvent.change(keyNameInput, {
        target: {
          value: '',
        },
      });
      fireEvent.change(publicKeyInput, {
        target: {
          value: '',
        },
      });
      // it seems we have to manually trigger the ods event
      ((keyNameInput as unknown) as OsdsInput).odsValueChange.emit({
        value: '',
      } as OdsInputValueChangeEventDetail);
      ((publicKeyInput as unknown) as OsdsInput).odsValueChange.emit({
        value: '',
      } as OdsInputValueChangeEventDetail);
    });
    expect(((keyNameInput as unknown) as OsdsInput).value).toBe('');
    expect(((publicKeyInput as unknown) as OsdsInput).value).toBe('');
    expect(submitButton).toHaveAttribute('disabled');
  });
});
