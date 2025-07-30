import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import DnsConfigurationForm from './DnsConfigurationForm';
import {
  baseDomainResource,
  domainZoneMock,
  ns1,
  ns2,
} from '@/domain/__mocks__/dnsDetails';
import { computeDisplayNameServers } from '@/domain/utils/dnsUtils';

vi.mock('@/domain/components/ModifyNameServer/NewDnsConfigModal', () => ({
  default: () => <div>Modal DNS</div>,
}));

describe('DnsConfigurationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (computeDisplayNameServers as jest.Mock).mockReturnValue([ns1, ns2]);
  });

  it(`affiche les serveurs initiaux et la ligne d'ajout`, () => {
    render(
      <DnsConfigurationForm
        selectedConfig={ActiveConfigurationTypeEnum.EXTERNAL}
        domainZone={domainZoneMock}
        serviceName={baseDomainResource.id}
        currentState={baseDomainResource.currentState}
      />,
    );
    const dnsLines = screen.getAllByTestId('dns-line');

    expect(dnsLines).toHaveLength(3);
    expect((dnsLines[0] as HTMLInputElement).value).toBe('ns1.example.com');
    expect((dnsLines[1] as HTMLInputElement).value).toBe('ns2.example.com');
    expect(dnsLines[2] as HTMLInputElement).toBeInTheDocument();

    expect(screen.getAllByTestId('dns-divider')).toHaveLength(2);

    expect(
      screen.getByText('domain_tab_DNS_modification_form_dns_number'),
    ).toBeInTheDocument();
  });

  it('ajoute un nouveau nameserver via la ligne editable et active le bouton Appliquer', () => {
    render(
      <DnsConfigurationForm
        selectedConfig={ActiveConfigurationTypeEnum.EXTERNAL}
        domainZone={domainZoneMock}
        serviceName={baseDomainResource.id}
        currentState={baseDomainResource.currentState}
      />,
    );

    const applyBtn = screen.getByTestId('apply-btn');
    const dnsLines = screen.getAllByTestId('dns-line');

    expect(applyBtn as HTMLButtonElement).toBeDisabled();
    fireEvent.change(dnsLines[2], { target: { value: 'ns3.example.com' } });
    fireEvent.click(screen.getByTestId('add-dns-button'));
    expect(applyBtn).toHaveAttribute('disabled', '');
  });

  it('supprime un serveur existant via le bouton Remove', () => {
    render(
      <DnsConfigurationForm
        selectedConfig={ActiveConfigurationTypeEnum.EXTERNAL}
        domainZone={domainZoneMock}
        serviceName={baseDomainResource.id}
        currentState={baseDomainResource.currentState}
      />,
    );
    const removeBtn = screen.getAllByTestId('remove-dns-button');
    fireEvent.click(removeBtn[1]);
    const dnsLines = screen.getAllByTestId('dns-line');
    expect(dnsLines).toHaveLength(2);
    expect((dnsLines[0] as HTMLInputElement).value).toBe('ns1.example.com');
    expect((dnsLines[1] as HTMLInputElement).value).toBe('');
  });
});
