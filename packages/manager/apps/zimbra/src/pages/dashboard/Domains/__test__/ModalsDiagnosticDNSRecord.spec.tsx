import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render } from '@/utils/test.provider';
import { DnsRecordType } from '@/utils';
import { domainDetailMock } from '@/api/_mock_';
import ModalDiagnosticDnsRecord from '../ModalDiagnosticDnsRecord.component';
import domainDiagnosticTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    domainId: domainDetailMock.id,
  }),
  vi.fn(),
]);

describe('Domain diagnostic modalc ', () => {
  it('should display diagnostic modal', async () => {
    const { findByText, getByTestId } = render(
      <ModalDiagnosticDnsRecord dnsRecordType={DnsRecordType.SRV} />,
    );

    expect(
      await findByText(
        domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_srv_title,
      ),
    ).toBeVisible();

    expect(
      getByTestId('diagnostic-srv-modal-secondary-btn'),
    ).toBeInTheDocument();
  });
});

describe('Domain diagnostic modal MX', () => {
  it('should display diagnostic modal', async () => {
    const { findByText, getByTestId } = render(
      <ModalDiagnosticDnsRecord dnsRecordType={DnsRecordType.MX} />,
    );

    expect(
      await findByText(
        domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_mx_title,
      ),
    ).toBeVisible();

    expect(
      getByTestId('diagnostic-mx-modal-secondary-btn'),
    ).toBeInTheDocument();
  });
});

describe('Domain diagnostic modal SPF', () => {
  it('should display diagnostic modal', async () => {
    const { findByText, getByTestId } = render(
      <ModalDiagnosticDnsRecord dnsRecordType={DnsRecordType.SPF} />,
    );

    expect(
      await findByText(
        domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_spf_title,
      ),
    ).toBeVisible();

    expect(
      getByTestId('diagnostic-spf-modal-secondary-btn'),
    ).toBeInTheDocument();
  });
});
