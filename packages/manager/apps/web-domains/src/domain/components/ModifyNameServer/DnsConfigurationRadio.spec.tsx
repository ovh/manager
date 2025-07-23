import '@/domain/setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DnsConfigurationRadio from './DnsConfigurationRadio';
import {
  baseDomainResource,
  domainZoneMock,
} from '@/domain/__mocks__/dnsDetails';
import { computeActiveConfiguration } from '@/domain/utils/dnsUtils';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';

vi.mock('@/domain/utils/dnsUtils', () => ({
  computeActiveConfiguration: vi.fn(),
}));

describe('DnsConfigurationRadio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (computeActiveConfiguration as jest.Mock).mockReturnValue(
      ActiveConfigurationTypeEnum.EXTERNAL,
    );
  });

  it('should render all radio options', () => {
    render(
      <DnsConfigurationRadio
        domainResource={baseDomainResource}
        domainZone={domainZoneMock}
      />,
    );

    const defaultOption = screen.queryByText(
      'domain_tab_DNS_modification_option_default',
    );
    expect(defaultOption).toBeInTheDocument();
    const externalOption = screen.queryByText(
      'domain_tab_DNS_modification_option_external',
    );
    expect(externalOption).toBeInTheDocument();
    const mixedOption = screen.queryByText(
      'domain_tab_DNS_modification_option_mixed',
    );
    expect(mixedOption).toBeInTheDocument();
  });

  it('should disable radios when domainZone is not available', () => {
    render(
      <DnsConfigurationRadio
        domainResource={baseDomainResource}
        domainZone={undefined}
      />,
    );

    const radios = screen.getAllByRole('radio');

    const defaultRadio = radios.find(
      (r) => r.getAttribute('value') === 'INTERNAL',
    );
    expect(defaultRadio).toBeDisabled();

    const mixedRadio = radios.find((r) => r.getAttribute('value') === 'MIXED');
    expect(mixedRadio).toBeDisabled();

    const externalRadio = radios.find(
      (r) => r.getAttribute('value') === 'EXTERNAL',
    );
    expect(externalRadio).not.toBeDisabled();
  });
});
