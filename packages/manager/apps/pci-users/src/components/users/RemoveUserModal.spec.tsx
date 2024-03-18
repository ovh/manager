import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import queryClient from '@/queryClient';
import RemoveUserModal from './RemoveUserModal';
import { useRemoveUser } from '@/hooks/useUser';

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

vi.mock('@/hooks/useUser', () => {
  const remove = vi.fn(() => {});
  return {
    useRemoveUser: () => ({
      remove,
    }),
    useUser: () => ({}),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <RemoveUserModal
        projectId="foo"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
        userId={'bar'}
      ></RemoveUserModal>
      ,
    </QueryClientProvider>,
  );
}

describe('Remove User modal', () => {
  it('should call the remove modal and delete a user', async () => {
    const useRemove = useRemoveUser({
      projectId: 'foo',
      userId: 'bar',
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
