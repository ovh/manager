import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { fireEvent, render } from '@/utils/test.provider';
import { platformMock, accountMock } from '@/api/_mock_';
import ModalDeleteEmailAccount from '../ModalDeleteEmailAccount.component';
import accountsDeleteTranslation from '@/public/translations/accounts/delete/Messages_fr_FR.json';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalDeleteEmailAccount />),
  useSearchParams: vi.fn(() => [
    new URLSearchParams({
      deleteDomainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    }),
  ]),
}));

vi.mock('@ovh-ux/manager-react-components', () => {
  return {
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: accountMock[0],
      isLoading: false,
    })),
  };
});

describe('Domains delete modal', () => {
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalDeleteEmailAccount />);
    expect(getByTestId('modal')).toHaveProperty(
      'headline',
      accountsDeleteTranslation.zimbra_account_delete_modal_title,
    );
  });

  it('check transition from step 1 to step 2', () => {
    const { getByTestId } = render(<ModalDeleteEmailAccount />);
    expect(getByTestId('text-step-1')).toBeVisible();
    fireEvent.click(getByTestId('primary-btn'));
    expect(getByTestId('text-step-2')).toBeVisible();
  });
});
