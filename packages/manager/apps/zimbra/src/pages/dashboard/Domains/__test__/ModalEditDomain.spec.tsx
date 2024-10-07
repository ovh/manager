import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@/utils/test.provider';
import { platformMock, domainMock, organizationListMock } from '@/api/_mock_';
import ModalEditDomain from '../ModalEditDomain.component';
import domainsEditTranslation from '@/public/translations/domains/edit/Messages_fr_FR.json';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useDomain: vi.fn(() => ({
      data: domainMock[0],
      isLoading: false,
    })),
    useOrganizationList: vi.fn(() => ({
      data: organizationListMock,
      isLoading: false,
    })),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalEditDomain />),
  useSearchParams: vi.fn(() => [
    new URLSearchParams({
      editDomainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
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

describe('Domains edit modal', () => {
  it('check if it is displayed', () => {
    const { getByTestId } = render(<ModalEditDomain />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainsEditTranslation.zimbra_domain_edit_modal_title,
    );
  });

  it('check if disabled input have the domain name', () => {
    const { getByTestId } = render(<ModalEditDomain />);
    const modal = getByTestId('input-domain');
    expect(modal).toHaveProperty('value', domainMock[0].currentState.name);
  });

  it('check the status of confirm cta', () => {
    const { getByTestId } = render(<ModalEditDomain />);
    const confirmCta = getByTestId('edit-btn');
    const selectOrganization = getByTestId('select-organization');
    expect(confirmCta).toBeDisabled();

    act(() => {
      fireEvent.change(selectOrganization, {
        target: { value: '1903b491-4d10-4000-8b70-f474d1abe601' },
      });

      // it seems we have to manually trigger the ods event
      selectOrganization.odsValueChange.emit({
        value: '1903b491-4d10-4000-8b70-f474d1abe601',
      });
    });

    expect(confirmCta).toBeEnabled();
  });
});
