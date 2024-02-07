import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import RemoveSshModal from '@/components/ssh-keys/RemoveSshModal';
import { useRemoveSsh } from '@/hooks/useSsh';
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
  const remove = vi.fn(() => {});
  return {
    useRemoveSsh: () => ({
      remove,
    }),
    useSshKey: () => ({}),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <RemoveSshModal
        projectId="foo"
        sshId="test"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
      ></RemoveSshModal>
      ,
    </QueryClientProvider>,
  );
}

describe('Add ssh modal', () => {
  it('should call the add function with given voucher id', async () => {
    const useRemove = useRemoveSsh({
      projectId: 'foo',
      sshId: 'test',
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const submitButton = screen.getByTestId('submitButton');
    expect(useRemove.remove).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(submitButton);
    });
    expect(useRemove.remove).toHaveBeenCalled();
  });
});
