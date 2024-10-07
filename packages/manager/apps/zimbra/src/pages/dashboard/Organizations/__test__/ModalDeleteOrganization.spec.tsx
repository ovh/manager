import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import { platformMock, domainMock } from '@/api/_mock_';
import ModalDeleteOrganization from '../ModalDeleteOrganization.component';
import organizationsDeleteTranslation from '@/public/translations/organizations/delete/Messages_fr_FR.json';

const { useDomainsMock } = vi.hoisted(() => ({
  useDomainsMock: vi.fn(() => ({
    data: domainMock,
    isLoading: false,
  })),
}));

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useDomains: useDomainsMock,
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalDeleteOrganization />),
  useSearchParams: vi.fn(() => [
    new URLSearchParams({
      deleteOrganizationId: '1903b491-4d10-4000-8b70-f474d1abe601',
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

describe('Organizations delete modal', () => {
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalDeleteOrganization />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      organizationsDeleteTranslation.zimbra_organization_delete_modal_title,
    );
  });

  it('if there is domain in organization', () => {
    const { getByTestId } = render(<ModalDeleteOrganization />);
    expect(getByTestId('banner-message')).toBeVisible();
    expect(getByTestId('delete-btn')).toBeDisabled();
  });

  it('if there is not domain in organization', () => {
    useDomainsMock.mockImplementation(
      vi.fn(() => ({
        data: [],
        isLoading: false,
      })),
    );
    const { getByTestId, queryByTestId } = render(<ModalDeleteOrganization />);
    expect(queryByTestId('banner-message')).toBeNull();
    expect(getByTestId('delete-btn')).not.toBeDisabled();
  });
});
