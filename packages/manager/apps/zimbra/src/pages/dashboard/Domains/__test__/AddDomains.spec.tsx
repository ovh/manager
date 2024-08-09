import React from 'react';
import { vi, describe, expect, it, afterEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, screen, waitFor } from '@/utils/test.provider';
import AddDomain from '../AddDomain';
import addDomainTranslation from '@/public/translations/domains/addDomain/Messages_fr_FR.json';
import { platformMock, organizationListMock, domainZone } from '@/api/_mock_';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';

vi.mock('@/hooks', () => ({
  usePlatform: vi.fn(() => ({
    platformId: platformMock[0].id,
  })),
  useOrganization: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
  useOrganizationList: vi.fn(() => ({
    data: organizationListMock,
    isLoading: false,
  })),
  useOverridePage: vi.fn(() => true),
  useGenerateUrl: vi.fn(() => null),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: domainZone,
      isLoading: false,
    })),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Add Domain page', () => {
  const clickSelectOrganization = async (selectOrganization) => {
    await act(async () => {
      fireEvent.change(selectOrganization, {
        target: { value: '1903b491-4d10-4000-8b70-f474d1abe601' },
      });
      selectOrganization.dispatchEvent(
        new CustomEvent('odsValueChange', {
          detail: { value: '1903b491-4d10-4000-8b70-f474d1abe601' },
        }),
      );
    });
  };

  const clickRadioDomainOvh = async (radioGroup) => {
    await act(async () => {
      radioGroup.dispatchEvent(
        new CustomEvent('odsValueChange', {
          detail: { newValue: 'ovhDomain' },
        }),
      );
    });
  };

  const clickRadioDomainExternal = async (radioGroup) => {
    await act(async () => {
      radioGroup.dispatchEvent(
        new CustomEvent('odsValueChange', {
          detail: { newValue: 'externalDomain' },
        }),
      );
    });
  };

  const clickIsselectedDomainOvh = async (selectDomain) => {
    await act(async () => {
      fireEvent.change(selectDomain, { target: { value: 'test.fr' } });
      selectDomain.dispatchEvent(
        new CustomEvent('odsValueChange', {
          detail: { value: 'test.fr' },
        }),
      );
    });
  };

  const clickIsselectedDomainExternal = async (input) => {
    await act(async () => {
      fireEvent.change(input, { target: { value: 'external-example.com' } });
      input.dispatchEvent(
        new CustomEvent('odsValueChange', {
          detail: { value: 'external-example.com' },
        }),
      );
    });
  };

  it('Page should display correctly', () => {
    render(<AddDomain />);

    const page = screen.getByTestId('add-domain-page');
    expect(page).toHaveTextContent(
      addDomainTranslation.zimbra_domains_add_domain_title_select,
    );
  });

  it('Button should be disabled if organization is selected but no domain name is provided', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization');
    await clickSelectOrganization(selectOrganization);

    // No domain is selected or input is provided
    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).toBeDisabled();
  });

  it('Button should be enabled when both organization and domain name are provided', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization');
    await clickSelectOrganization(selectOrganization);

    const radioGroup = getByTestId('radio-group');
    await waitFor(() => {
      expect(radioGroup).toBeDefined();
    });

    await clickRadioDomainOvh(radioGroup);

    const selectedDomain = getByTestId('select-domain');
    await clickIsselectedDomainOvh(selectedDomain);

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toBeEnabled();
    });
  });

  it('Button should be enabled when an external domain name is provided', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization');
    await clickSelectOrganization(selectOrganization);

    const radioGroup = getByTestId('radio-group');
    await waitFor(() => {
      expect(radioGroup).toBeDefined();
    });

    await clickRadioDomainExternal(radioGroup);

    const externalDomainInput = getByTestId('input-external-domain');
    await clickIsselectedDomainExternal(externalDomainInput);
    expect(externalDomainInput).toHaveValue('external-example.com');

    const warningMessage = screen.getByText(
      addDomainTranslation.zimbra_domains_add_domain_warning_modification_domain,
    );
    expect(warningMessage).toBeVisible();

    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).toBeEnabled();
  });
});
