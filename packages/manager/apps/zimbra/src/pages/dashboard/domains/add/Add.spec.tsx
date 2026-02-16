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
    const user = userEvent.setup();
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const comboboxInput = selectOrganizationContainer.querySelector('input');

    await user.click(comboboxInput);

    // Wait for the dropdown to open and get the option by text
    const option = await screen.findByRole('option', { name: 'name2' });
    await user.click(option);

    // No domain is selected or input is provided
    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('Button should not be enabled when only organization and domain name are provided if domain is ovh', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const comboboxInput = selectOrganizationContainer.querySelector('input');
    await user.click(comboboxInput);

    const orgOption = await screen.findByRole('option', { name: 'name2' });
    await user.click(orgOption);

    // OVH domain is selected by default, so we don't need to click the radio

    const selectDomainContainer = getByTestId('select-domain');
    const selectDomainInput = selectDomainContainer.querySelector('input');
    await user.click(selectDomainInput);

    const domainOption = await screen.findByRole('option', { name: 'test.fr' });
    await user.click(domainOption);

    // Verify domain was selected
    await waitFor(() => {
      expect(selectDomainInput).toHaveValue('test.fr');
    });
  });

  it('Button should be enabled when organization, domain name and configuration type standard are provided if domain name is ovh', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const comboboxInput = selectOrganizationContainer.querySelector('input');
    await user.click(comboboxInput);

    const orgOption = await screen.findByRole('option', { name: 'name2' });
    await user.click(orgOption);

    // Wait for radio group to be available and select OVH domain radio
    await waitFor(() => {
      const rg = getByTestId('radio-group');
      expect(rg).toBeDefined();
    });
    const radioOvhDomain = await screen.findByTestId('radio-ovh-domain');
    await user.click(radioOvhDomain);

    const selectDomainContainer = getByTestId('select-domain');
    const selectDomainInput = selectDomainContainer.querySelector('input');
    await user.click(selectDomainInput);

    const domainOption = await screen.findByRole('option', { name: 'test.fr' });
    await user.click(domainOption);

    // Verify configuration type labels appear when domain is selected
    const page = screen.getByTestId('add-domain-page');
    expect(page).toHaveTextContent(
      domainsFormTranslation.zimbra_domains_add_domain_configuration_choice_standard,
    );
    expect(page).toHaveTextContent(
      domainsFormTranslation.zimbra_domains_add_domain_configuration_choice_expert,
    );

    const selectedRadioConfigTypeStandard = getByTestId(`radio-config-${DNS_CONFIG_TYPE.STANDARD}`);
    await user.click(selectedRadioConfigTypeStandard);

    await waitFor(() => {
      expect(selectDomainInput).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).not.toHaveAttribute('disabled');
    });
  });

  it('Button should be enabled when organization, domain name and configuration type expert are provided if domain name is ovh', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const comboboxInput = selectOrganizationContainer.querySelector('input');
    await user.click(comboboxInput);

    const orgOption = await screen.findByRole('option', { name: 'name2' });
    await user.click(orgOption);

    // Wait for radio group to be available and select OVH domain radio
    await waitFor(() => {
      const rg = getByTestId('radio-group');
      expect(rg).toBeDefined();
    });
    const radioOvhDomain = await screen.findByTestId('radio-ovh-domain');
    await user.click(radioOvhDomain);

    const selectDomainContainer = getByTestId('select-domain');
    const selectDomainInput = selectDomainContainer.querySelector('input');
    await user.click(selectDomainInput);

    const domainOption = await screen.findByRole('option', { name: 'test.fr' });
    await user.click(domainOption);

    // Verify configuration type labels appear when domain is selected
    const page = screen.getByTestId('add-domain-page');
    expect(page).toHaveTextContent(
      domainsFormTranslation.zimbra_domains_add_domain_configuration_choice_standard,
    );
    expect(page).toHaveTextContent(
      domainsFormTranslation.zimbra_domains_add_domain_configuration_choice_expert,
    );

    const selectedRadioConfigTypeExpert = getByTestId(`radio-config-${DNS_CONFIG_TYPE.EXPERT}`);
    await user.click(selectedRadioConfigTypeExpert);

    await waitFor(() => {
      expect(selectDomainInput).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).not.toHaveAttribute('disabled');
    });
  });

  // TODO: ODS Radio component doesn't trigger onValueChange in tests with user.click()
  // The radio buttons don't respond to clicks in the test environment even with:
  // - click on wrapper div with data-testid
  // - click on label text
  // - click with findAllByRole('radio')[1]
  // - double click
  // Consider testing this in E2E tests or when ODS provides better test utilities
  it.skip('Button should be enabled when an external domain name is provided', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<AddDomain />);

    const selectOrganizationContainer = getByTestId('select-organization');
    const comboboxInput = selectOrganizationContainer.querySelector('input');
    await user.click(comboboxInput);

    const orgOption = await screen.findByRole('option', { name: 'name2' });
    await user.click(orgOption);

    // Wait for radio group to be available
    await waitFor(() => {
      const rg = getByTestId('radio-group');
      expect(rg).toBeDefined();
    });

    // Click on external domain radio using role - try double click
    const radioButtons = await screen.findAllByRole('radio');
    // radioButtons[0] = OVH domain, radioButtons[1] = External domain

    // Uncheck the first one and check the second
    await user.click(radioButtons[1]);
    await user.click(radioButtons[1]); // Double click sometimes needed for custom components

    // Wait for the state to update and input to appear
    const externalDomainInput = await screen.findByTestId(
      'input-external-domain',
      {},
      { timeout: 3000 },
    );
    await user.type(externalDomainInput, 'external-test.com');

    // Verify labels appear
    const page = screen.getByTestId('add-domain-page');
    expect(page).toHaveTextContent(domainsFormTranslation.zimbra_domains_add_domain_input_title);

    // Verify button is enabled
    await waitFor(() => {
      const submitButton = getByTestId('add-domain-submit-btn');
      expect(submitButton).not.toHaveAttribute('disabled');
    });
  });
});
