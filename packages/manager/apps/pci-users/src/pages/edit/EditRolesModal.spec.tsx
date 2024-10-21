import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import queryClient from '@/queryClient';
import EditRolesModal from './EditRolesModal';
import * as roleHook from '@/api/hooks/useRole';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
  }),
}));

vi.mock('@/api/hooks/useRole', () => {
  const update = vi.fn(() => {});
  return {
    useUpdateUserRoles: () => ({
      update,
      isPending: false,
    }),
    useAllRoles: vi.fn(() => ({ isPending: false })),
  };
});

vi.mock('@/api/hooks/useUser', () => {
  return {
    useUserRoles: vi.fn(() => ({ isPending: false })),
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
    const mockUpdate = vi.fn();

    vi.spyOn(roleHook, 'useUpdateUserRoles').mockReturnValue(({
      isPending: false,
      update: mockUpdate,
    } as unknown) as any);

    renderModal();

    const submitRolesEditButton = screen.getByTestId('submitRolesEditButton');

    act(() => {
      fireEvent.click(submitRolesEditButton);
    });

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
