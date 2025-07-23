import React from 'react';

import { describe, expect, it } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import domainsFormTranslation from '@/public/translations/domains/form/Messages_fr_FR.json';
import { DNS_CONFIG_TYPE } from '@/utils';
import { act, render, screen, waitFor } from '@/utils/test.provider';
import { OdsHTMLElement } from '@/utils/test.utils';

import AddDomain from './Add.page';

describe('Add Domain page', () => {
  const clickSelectOrganization = (selectOrganization: OdsHTMLElement) => {
    act(() => {
      selectOrganization.odsChange.emit({
        name: 'organization',
        value: '1903b491-4d10-4000-8b70-f474d1abe601',
      });
    });
  };

  const clickIsselectedDomainOvh = (selectDomain: OdsHTMLElement) => {
    act(() => {
      selectDomain.odsChange.emit({
        name: 'domain',
        value: 'test.fr',
      });
    });
  };

  it('Page should display correctly', () => {
    render(<AddDomain />);

    const page = screen.getByTestId('add-domain-page');
    expect(page).toHaveTextContent(commonTranslation.add_domain);
  });

  it('Button should be disabled if organization is selected but no domain name is provided', () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization') as OdsHTMLElement;
    clickSelectOrganization(selectOrganization);

    // No domain is selected or input is provided
    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).toHaveAttribute('is-disabled', 'true');
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should not be enabled when only organization and domain name are provided if domain is ovh', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization') as OdsHTMLElement;
    clickSelectOrganization(selectOrganization);

    const radioOvhDomain = getByTestId('radio-externalDomain') as OdsHTMLElement;
    act(() => {
      radioOvhDomain.odsChange.emit({
        value: 'ovhDomain',
      });
    });

    const selectedDomain = getByTestId('select-domain') as OdsHTMLElement;
    clickIsselectedDomainOvh(selectedDomain);

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toHaveAttribute('is-disabled', 'true');
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when organization, domain name and configuration type standard are provided if domain name is ovh', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization') as OdsHTMLElement;
    clickSelectOrganization(selectOrganization);

    const radioOvhDomain = getByTestId('radio-externalDomain') as OdsHTMLElement;
    act(() => {
      radioOvhDomain.odsChange.emit({
        value: 'ovhDomain',
      });
    });

    const selectedDomain = getByTestId('select-domain') as OdsHTMLElement;
    clickIsselectedDomainOvh(selectedDomain);

    const selectedRadioConfigTypeStandard = getByTestId('radio-config-standard') as OdsHTMLElement;
    act(() => {
      selectedRadioConfigTypeStandard.odsChange.emit({
        value: DNS_CONFIG_TYPE.STANDARD,
      });
    });

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toHaveAttribute('is-disabled', 'false');
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when organization, domain name and configuration type expert are provided if domain name is ovh', async () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization') as OdsHTMLElement;
    clickSelectOrganization(selectOrganization);

    const radioGroup = getByTestId('radio-group');
    await waitFor(() => {
      expect(radioGroup).toBeDefined();
    });

    const radioOvhDomain = getByTestId('radio-externalDomain') as OdsHTMLElement;
    act(() => {
      radioOvhDomain.odsChange.emit({
        value: 'ovhDomain',
      });
    });

    const selectedDomain = getByTestId('select-domain') as OdsHTMLElement;
    clickIsselectedDomainOvh(selectedDomain);

    const selectedRadioConfigTypeExpert = getByTestId('radio-config-expert') as OdsHTMLElement;
    act(() => {
      selectedRadioConfigTypeExpert.odsChange.emit({
        value: DNS_CONFIG_TYPE.EXPERT,
      });
    });

    await waitFor(() => {
      expect(selectedDomain).toBeDefined();
      expect(getByTestId('add-domain-submit-btn')).toHaveAttribute('is-disabled', 'false');
    });
  });

  // TODO: Remove skip when FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION && FEATURE_FLAGS.DOMAIN_NOT_OVH are removed
  it.skip('Button should be enabled when an external domain name is provided', () => {
    const { getByTestId } = render(<AddDomain />);

    const selectOrganization = getByTestId('select-organization') as OdsHTMLElement;
    clickSelectOrganization(selectOrganization);

    const radioExternalDomain = getByTestId('radio-externalDomain') as OdsHTMLElement;
    act(() => {
      radioExternalDomain.odsChange.emit({
        value: 'externalDomain',
      });
    });

    const externalDomainInput = getByTestId('input-external-domain') as OdsHTMLElement;

    act(() => {
      externalDomainInput.odsChange.emit({
        name: 'ext-domain',
        value: 'external-example.com',
      });
    });
    expect(externalDomainInput).toHaveValue('external-example.com');

    const warningMessage = screen.getByText(
      domainsFormTranslation.zimbra_domains_add_domain_warning_modification_domain,
    );
    expect(warningMessage).toBeVisible();

    const submitButton = getByTestId('add-domain-submit-btn');
    expect(submitButton).toHaveAttribute('is-disabled', 'false');
  });
});
