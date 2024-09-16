import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import { DnsRecordType } from '@/utils';
import { platformMock, domainMock } from '@/api/_mock_';
import { DomainType } from '@/api/domain';
import ModalDiagnosticDnsRecord from '../ModalDiagnosticDnsRecord';
import domainDiagnosticTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useDomain: (id: string) => ({
      data: domainMock.find((domain: DomainType) => id === domain.id),
      isLoading: false,
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(() => [
      new URLSearchParams({
        domainId: domainMock[0].id,
      }),
    ]),
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

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Domain diagnostic modalc ', () => {
  it('should display diagnostic modal', () => {
    const { getByTestId } = render(
      <ModalDiagnosticDnsRecord dnsRecordType={DnsRecordType.SRV} />,
    );
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_srv_title,
    );
    expect(getByTestId('diagnostic-srv-modal-secondary-btn')).toBeEnabled();
  });
});

describe('Domain diagnostic modal MX', () => {
  it('should display diagnostic modal', () => {
    const { getByTestId } = render(
      <ModalDiagnosticDnsRecord dnsRecordType={DnsRecordType.MX} />,
    );
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_mx_title,
    );
    expect(getByTestId('diagnostic-mx-modal-secondary-btn')).toBeEnabled();
  });
});

describe('Domain diagnostic modal SPF', () => {
  it('should display diagnostic modal', () => {
    const { getByTestId } = render(
      <ModalDiagnosticDnsRecord dnsRecordType={DnsRecordType.SPF} />,
    );
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_spf_title,
    );
    expect(getByTestId('diagnostic-spf-modal-secondary-btn')).toBeEnabled();
  });
});
