import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import { platformMock, accountMock } from '@/api/_mock_';
import ModalDeleteDomain from '../ModalDeleteDomain.component';
import domainsDeleteTranslation from '@/public/translations/domains/delete/Messages_fr_FR.json';

const { useAccountListMock } = vi.hoisted(() => ({
  useAccountListMock: vi.fn(() => ({
    data: accountMock,
    isLoading: false,
  })),
}));

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useAccountList: useAccountListMock,
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalDeleteDomain />),
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Domains delete modal', () => {
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalDeleteDomain />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainsDeleteTranslation.zimbra_domain_delete_modal_title,
    );
  });

  it('if have email use the domain', () => {
    const { getByTestId } = render(<ModalDeleteDomain />);
    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toBeDisabled();
  });

  it('if there is not email use the domain', () => {
    useAccountListMock.mockImplementation(
      vi.fn(() => ({
        data: [],
        isLoading: false,
      })),
    );
    const { getByTestId, queryByTestId } = render(<ModalDeleteDomain />);
    expect(queryByTestId('banner-message')).toBeNull();
    expect(getByTestId('delete-btn')).not.toBeDisabled();
  });
});
