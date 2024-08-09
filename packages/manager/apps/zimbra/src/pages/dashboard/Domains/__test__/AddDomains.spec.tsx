import React from 'react';
import { describe, expect, it } from 'vitest';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, screen, waitFor } from '@/utils/test.provider';
import AddDomain from '../AddDomain.page';
import addDomainTranslation from '@/public/translations/domains/addDomain/Messages_fr_FR.json';

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

  const clickRadioConfigType = async (radioGroup, type) => {
    await act(async () => {
      radioGroup.dispatchEvent(
        new CustomEvent('odsValueChange', {
          detail: { newValue: type },
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

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should not be enabled when only organization and domain name are provided if domain is ovh', async () => {
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
      expect(getByTestId('add-domain-submit-btn')).toBeDisabled();
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when organization, domain name and configuration type standard are provided if domain name is ovh', async () => {
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

    const selectedRadioConfigType = getByTestId('radio-group-config');
    await clickRadioConfigType(
      selectedRadioConfigType,
      'standardConfiguration',
    );

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toBeEnabled();
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when organization, domain name and configuration type expert are provided if domain name is ovh', async () => {
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

    const selectedRadioConfigType = getByTestId('radio-group-config');
    await clickRadioConfigType(selectedRadioConfigType, 'expertConfiguration');

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toBeEnabled();
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when an external domain name is provided', async () => {
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
