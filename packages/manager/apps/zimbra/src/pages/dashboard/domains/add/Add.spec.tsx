import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import domainsFormTranslation from '@/public/translations/domains/form/Messages_fr_FR.json';
import { DNS_CONFIG_TYPE } from '@/utils';
import { render } from '@/utils/test.provider';

import AddDomain from './Add.page';

describe('Add Domain page', () => {
  it('Page should display correctly', () => {
    render(<AddDomain />);

    const page = screen.getByTestId('add-domain-page');
    expect(page).toHaveTextContent(commonTranslation.add_domain);
  });

  it('Button should be disabled if organization is selected but no domain name is provided', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const selectOrganization = selectOrganizationContainer.querySelector('select');
    await userEvent.selectOptions(selectOrganization, '1903b491-4d10-4000-8b70-f474d1abe602');

    // No domain is selected or input is provided
    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).toHaveAttribute('disabled');
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should not be enabled when only organization and domain name are provided if domain is ovh', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const selectOrganization = selectOrganizationContainer.querySelector('select');
    await userEvent.selectOptions(selectOrganization, '1903b491-4d10-4000-8b70-f474d1abe602');

    const radioOvhDomain = getByTestId('radio-externalDomain');
    await userEvent.selectOptions(radioOvhDomain, 'ovhDomain');

    const selectedDomain = getByTestId('select-domain');
    await userEvent.selectOptions(selectedDomain, 'test.fr');

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toHaveAttribute('disabled');
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when organization, domain name and configuration type standard are provided if domain name is ovh', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const selectOrganization = selectOrganizationContainer.querySelector('select');
    await userEvent.selectOptions(selectOrganization, '1903b491-4d10-4000-8b70-f474d1abe602');

    const radioOvhDomain = getByTestId('radio-externalDomain');
    await userEvent.selectOptions(radioOvhDomain, 'ovhDomain');

    const selectedDomain = getByTestId('select-domain');
    await userEvent.selectOptions(selectedDomain, 'test.fr');

    const selectedRadioConfigTypeStandard = getByTestId('radio-config-standard');
    await userEvent.selectOptions(selectedRadioConfigTypeStandard, DNS_CONFIG_TYPE.STANDARD);

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).not.toHaveAttribute('disabled');
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when organization, domain name and configuration type expert are provided if domain name is ovh', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const selectOrganization = selectOrganizationContainer.querySelector('select');
    await userEvent.selectOptions(selectOrganization, '1903b491-4d10-4000-8b70-f474d1abe602');

    const radioGroup = getByTestId('radio-group');
    await waitFor(() => {
      expect(radioGroup).toBeDefined();
    });

    const radioOvhDomain = getByTestId('radio-externalDomain');
    await userEvent.selectOptions(radioOvhDomain, 'ovhDomain');

    const selectedDomain = getByTestId('select-domain');
    await userEvent.selectOptions(selectedDomain, 'test.fr');

    const selectedRadioConfigTypeExpert = getByTestId('radio-config-expert');
    await userEvent.selectOptions(selectedRadioConfigTypeExpert, DNS_CONFIG_TYPE.EXPERT);

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).not.toHaveAttribute('disabled');
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when an external domain name is provided', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const selectOrganization = selectOrganizationContainer.querySelector('select');
    await userEvent.selectOptions(selectOrganization, '1903b491-4d10-4000-8b70-f474d1abe602');

    const radioExternalDomain = getByTestId('radio-externalDomain');
    await userEvent.selectOptions(radioExternalDomain, 'externalDomain');

    const externalDomainInput = getByTestId('input-external-domain');
    await userEvent.selectOptions(externalDomainInput, 'external-example.com');

    expect(externalDomainInput).toHaveValue('external-example.com');

    const warningMessage = screen.getByText(
      domainsFormTranslation.zimbra_domains_add_domain_warning_modification_domain,
    );
    expect(warningMessage).toBeVisible();

    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).not.toHaveAttribute('disabled');
  });
});
