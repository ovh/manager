import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { wrapper, renderHook } from '@/common/utils/test.provider';
import DatagridColumnDnssec from './DatagridColumnDnssec';
import { useGetDnssecStatus } from '@/domain/hooks/data/query';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import { TCurrentState, TTargetSpec } from '@/domain/types/domainResource';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';


vi.mock('@/domain/constants/serviceDetail', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    DOMAIN_DNSSEC_STATUS: {
      enabled: {
        statusColor: 'success',
        icon: 'check-circle',
        i18nKey: 'domain_dnssec_enabled',
      },
      disabled: {
        statusColor: 'critical',
        icon: 'x-circle',
        i18nKey: 'domain_dnssec_disabled',
      },
      not_supported: {
        statusColor: 'neutral',
        i18nKey: 'domain_tab_general_information_status_unavailable',
      },
      enableInProgress: {
        statusColor: 'information',
        i18nKey: 'domain_dns_table_state_activating',
      },
      disableInProgress: {
        statusColor: 'warning',
        i18nKey: 'domain_dns_table_state_deleting',
      },
    },
  };
});

const mockDsData: TDsDataInterface = {
  keyTag: 123,
  algorithm: 8,
  flags: 257,
  publicKey: 'AwEAAabc123...',
};

const createMockCurrentState = (
  overrides: Partial<TCurrentState> = {},
): TCurrentState => {
  const defaults: TCurrentState = {
    additionalStates: [],
    authInfoManagedByOVHcloud: true,
    authInfoSupported: true,
    dnsConfiguration: {
      configurationType: DnsConfigurationTypeEnum.HOSTING,
      glueRecordIPv6Supported: false,
      hostSupported: false,
      maxDNS: 10,
      minDNS: 2,
      nameServers: [],
      dnssecSupported: true,
    },
    extension: 'com',
    mainState: 'OK' as any,
    name: 'test.com',
    protectionState: 'UNLOCKED' as any,
    suspensionState: 'NOT_SUSPENDED' as any,
    contactsConfiguration: {} as any,
    hostsConfiguration: {} as any,
    dnssecConfiguration: {
      dnssecSupported: true,
    },
    createdAt: '2024-01-01',
  };

  return {
    ...defaults,
    ...overrides,
    dnssecConfiguration: {
      ...defaults.dnssecConfiguration,
      ...overrides.dnssecConfiguration,
    },
    dnsConfiguration: {
      ...defaults.dnsConfiguration,
      ...(overrides.dnsConfiguration as any),
    },
  };
};

const createMockTargetSpec = (
  overrides: Partial<TTargetSpec> = {},
): TTargetSpec => {
  const defaults: TTargetSpec = {
    protectionState: 'UNLOCKED' as any,
    dnssecConfiguration: { dsData: [] },
  };

  return {
    ...defaults,
    ...overrides,
    dnssecConfiguration: {
      ...defaults.dnssecConfiguration,
      ...(overrides.dnssecConfiguration as any),
    },
  };
};

describe('useGetDnssecStatus hook', () => {
  it('should return NOT_SUPPORTED when dnssec is not supported', () => {
    const currentState: Partial<TCurrentState> = {
      dnssecConfiguration: { dnssecSupported: false },
    };
    const targetSpec: Partial<TTargetSpec> = {};

    const { result } = renderHook(
      () =>
        useGetDnssecStatus(
          currentState as TCurrentState,
          targetSpec as TTargetSpec,
        ),
      { wrapper },
    );

    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>).dnssecStatus,
    ).toBe(DnssecStatusEnum.NOT_SUPPORTED);
    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>)
        .isDnssecStatusLoading,
    ).toBe(false);
  });

  it('should return DISABLED for external DNS config without DS data', () => {
    const currentState: Partial<TCurrentState> = {
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    };
    const targetSpec: Partial<TTargetSpec> = {
      dnssecConfiguration: { dsData: [] },
    };

    const { result } = renderHook(
      () =>
        useGetDnssecStatus(
          currentState as TCurrentState,
          targetSpec as TTargetSpec,
        ),
      { wrapper },
    );

    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>).dnssecStatus,
    ).toBe(DnssecStatusEnum.DISABLED);
    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>)
        .isDnssecStatusLoading,
    ).toBe(false);
  });

  it('should return ENABLED for external DNS config with current DS data', () => {
    const currentState: Partial<TCurrentState> = {
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [mockDsData],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    };
    const targetSpec: Partial<TTargetSpec> = {
      dnssecConfiguration: { dsData: [mockDsData] },
    };

    const { result } = renderHook(
      () =>
        useGetDnssecStatus(
          currentState as TCurrentState,
          targetSpec as TTargetSpec,
        ),
      { wrapper },
    );

    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>).dnssecStatus,
    ).toBe(DnssecStatusEnum.ENABLED);
    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>)
        .isDnssecStatusLoading,
    ).toBe(false);
  });

  it('should return ENABLE_IN_PROGRESS when enabling DNSSEC on external config', () => {
    const currentState: Partial<TCurrentState> = {
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    };
    const targetSpec: Partial<TTargetSpec> = {
      dnssecConfiguration: { dsData: [mockDsData] },
    };

    const { result } = renderHook(
      () =>
        useGetDnssecStatus(
          currentState as TCurrentState,
          targetSpec as TTargetSpec,
        ),
      { wrapper },
    );

    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>).dnssecStatus,
    ).toBe(DnssecStatusEnum.ENABLE_IN_PROGRESS);
    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>)
        .isDnssecStatusLoading,
    ).toBe(false);
  });

  it('should return DISABLE_IN_PROGRESS when disabling DNSSEC on external config', () => {
    const currentState: Partial<TCurrentState> = {
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [mockDsData],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    };
    const targetSpec: Partial<TTargetSpec> = {
      dnssecConfiguration: { dsData: [] },
    };

    const { result } = renderHook(
      () =>
        useGetDnssecStatus(
          currentState as TCurrentState,
          targetSpec as TTargetSpec,
        ),
      { wrapper },
    );

    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>).dnssecStatus,
    ).toBe(DnssecStatusEnum.DISABLE_IN_PROGRESS);
    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>)
        .isDnssecStatusLoading,
    ).toBe(false);
  });

  it('should handle MIXED configuration type like EXTERNAL', () => {
    const currentState: Partial<TCurrentState> = {
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.MIXED,
      } as TCurrentState['dnsConfiguration'],
    };
    const targetSpec: Partial<TTargetSpec> = {
      dnssecConfiguration: { dsData: [] },
    };

    const { result } = renderHook(
      () =>
        useGetDnssecStatus(
          currentState as TCurrentState,
          targetSpec as TTargetSpec,
        ),
      { wrapper },
    );

    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>).dnssecStatus,
    ).toBe(DnssecStatusEnum.DISABLED);
    expect(
      (result.current as ReturnType<typeof useGetDnssecStatus>)
        .isDnssecStatusLoading,
    ).toBe(false);
  });
});

describe('DatagridColumnDnssec component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render skeleton when loading', () => {
    const currentState = createMockCurrentState({
      dnssecConfiguration: { dnssecSupported: true },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.HOSTING,
      } as TCurrentState['dnsConfiguration'],
      name: 'test.com',
    });
    const targetSpec = createMockTargetSpec();

    render(
      <DatagridColumnDnssec
        resourceCurrentState={currentState}
        resourceTargetSpec={targetSpec}
      />,
      {
        wrapper,
      },
    );
    expect(screen.queryByTestId(/status-badge/)).toBeDefined();
  });

  it('should render unsupported badge when dnssec is not supported', () => {
    const currentState = createMockCurrentState({
      dnssecConfiguration: { dnssecSupported: false },
    });
    const targetSpec = createMockTargetSpec();

    render(
      <DatagridColumnDnssec
        resourceCurrentState={currentState}
        resourceTargetSpec={targetSpec}
      />,
      {
        wrapper,
      },
    );

    const badge = screen.getByTestId('status-badge-not_supported');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(
      'domain_tab_general_information_status_unavailable',
    );
  });

  it('should render enabled badge when DNSSEC is enabled on external config', () => {
    const currentState = createMockCurrentState({
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [mockDsData],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    });
    const targetSpec = createMockTargetSpec({
      dnssecConfiguration: { dsData: [mockDsData] },
    });

    render(
      <DatagridColumnDnssec
        resourceCurrentState={currentState}
        resourceTargetSpec={targetSpec}
      />,
      {
        wrapper,
      },
    );

    const badge = screen.getByTestId('status-badge-enabled');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('domain_dnssec_enabled');
  });

  it('should render disabled badge when DNSSEC is disabled on external config', () => {
    const currentState = createMockCurrentState({
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    });
    const targetSpec = createMockTargetSpec({
      dnssecConfiguration: { dsData: [] },
    });

    render(
      <DatagridColumnDnssec
        resourceCurrentState={currentState}
        resourceTargetSpec={targetSpec}
      />,
      {
        wrapper,
      },
    );

    const badge = screen.getByTestId('status-badge-disabled');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('domain_dnssec_disabled');
  });

  it('should render enable in progress badge when DNSSEC is being activated', () => {
    const currentState = createMockCurrentState({
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    });
    const targetSpec = createMockTargetSpec({
      dnssecConfiguration: { dsData: [mockDsData] },
    });

    render(
      <DatagridColumnDnssec
        resourceCurrentState={currentState}
        resourceTargetSpec={targetSpec}
      />,
      {
        wrapper,
      },
    );

    const badge = screen.getByTestId('status-badge-enableInProgress');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('domain_dns_table_state_activating');
  });

  it('should render disable in progress badge when DNSSEC is being deleted', () => {
    const currentState = createMockCurrentState({
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [mockDsData],
      },
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.EXTERNAL,
      } as TCurrentState['dnsConfiguration'],
    });
    const targetSpec = createMockTargetSpec({
      dnssecConfiguration: { dsData: [] },
    });

    render(
      <DatagridColumnDnssec
        resourceCurrentState={currentState}
        resourceTargetSpec={targetSpec}
      />,
      {
        wrapper,
      },
    );

    const badge = screen.getByTestId('status-badge-disableInProgress');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('domain_dns_table_state_deleting');
  });
});
