import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddSshModal from '@/components/ssh-keys/AddSshModal';
import { useAddSsh } from '@/hooks/useSsh';
import queryClient from '@/queryClient';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
  }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('@/hooks/useSsh', () => {
  const add = vi.fn(() => {});
  return {
    useAddSsh: () => ({
      add,
    }),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <AddSshModal
        projectId="foo"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
      ></AddSshModal>
      ,
    </QueryClientProvider>,
  );
}

describe('Add ssh modal', () => {
  it('should call the add function with given voucher id', async () => {
    const useAdd = useAddSsh({
      projectId: 'foo',
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const keyNameInput = screen.getByTestId('sshKeyName');
    const publicKeyInput = screen.getByTestId('sshPublicKey');
    const submitButton = screen.getByTestId('submitButton');
    expect(useAdd.add).not.toHaveBeenCalled();
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
      keyNameInput.odsValueChange.emit({ value: 'name of ssh key' });
      publicKeyInput.odsValueChange.emit({ value: 'public ssh key' });
    });
    expect(keyNameInput.value).toBe('name of ssh key');
    expect(publicKeyInput.value).toBe('public ssh key');
    act(() => {
      fireEvent.click(submitButton);
    });
    expect(useAdd.add).toHaveBeenCalledWith({
      name: 'name of ssh key',
      publicKey: 'public ssh key',
    });
  });
  it('should disable submit button if no key is specified', async () => {
    renderModal();
    const keyNameInput = screen.getByTestId('sshKeyName');
    const publicKeyInput = screen.getByTestId('sshPublicKey');
    const submitButton = screen.getByTestId('submitButton');
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
      keyNameInput.odsValueChange.emit({ value: '' });
      publicKeyInput.odsValueChange.emit({ value: '' });
    });
    expect(keyNameInput.value).toBe('');
    expect(publicKeyInput.value).toBe('');
    expect(submitButton).toHaveAttribute('disabled');
  });
});
