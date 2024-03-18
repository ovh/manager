import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import queryClient from '@/queryClient';
import EditRolesModal from './EditRolesModal';
import { useUpdateUserRoles } from '@/hooks/useRole';

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

vi.mock('@/hooks/useRole', () => {
  const update = vi.fn(() => {});
  return {
    useUpdateUserRoles: () => ({
      update,
    }),
    useAllRoles: () => ({}),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <EditRolesModal
        projectId="foo"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
        userId={123456}
      ></EditRolesModal>
      ,
    </QueryClientProvider>,
  );
}

describe('Edit Role modal', () => {
  it('should call the modal and edit role', async () => {
    const useUpdate = useUpdateUserRoles({
      projectId: 'foo',
      userId: 123456,
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const submitRolesEditButton = screen.getByTestId('submitRolesEditButton');
    expect(useUpdate.update).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(submitRolesEditButton);
    });
    expect(useUpdate.update).toHaveBeenCalled();
  });
});
