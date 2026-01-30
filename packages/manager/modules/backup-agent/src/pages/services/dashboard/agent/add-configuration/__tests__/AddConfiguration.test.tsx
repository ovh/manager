import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DrawerProps } from '@ovh-ux/manager-react-components';

import { mockAgentDownloadLinks } from '@/mocks/agents/agentDownloadLinks';
import { BAREMETALS_MOCK } from '@/mocks/baremetals/baremetals.mocks';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { OS_LABELS } from '@/module.constants';

import AddConfigurationPage from '../AddConfiguration.page';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => ({ navigate: vi.fn() }),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock('@hookform/resolvers/zod', async () => {
  const { createZodResolverMock } = await import('@/test-utils/zodResolverMock');
  return { zodResolver: createZodResolverMock() };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `translated_${key}`,
  }),
}));

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: vi
    .fn()
    .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
  OdsMessage: vi
    .fn()
    .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
  OdsCode: vi
    .fn()
    .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
  OdsButton: vi
    .fn()
    .mockImplementation(({ label, ...props }: { children: React.ReactNode; label: string }) => (
      <button {...props}>{label}</button>
    )),
  OdsFormField: vi
    .fn()
    .mockImplementation(
      ({ children, error, ...props }: { children: React.ReactNode; error: string }) => (
        <div {...props}>
          {children}
          {!!error && <div>{error}</div>}
        </div>
      ),
    ),
  OdsCombobox: vi
    .fn()
    .mockImplementation(
      ({
        children,
        onOdsChange,
        onOdsBlur,
        isDisabled,
        isRequired,
        ...props
      }: {
        children: React.ReactNode;
        name: string;
        onOdsChange: () => void;
        isDisabled: boolean;
        isRequired: boolean;
        onOdsBlur: () => void;
      }) => (
        <select
          onChange={onOdsChange}
          onBlur={onOdsBlur}
          data-disabled={isDisabled}
          data-required={isRequired}
          data-testid={`select-${props.name}`}
          {...props}
        >
          {children}
        </select>
      ),
    ),
  OdsSelect: vi
    .fn()
    .mockImplementation(
      ({
        children,
        onOdsChange,
        onOdsBlur,
        isDisabled,
        isRequired,
        ...props
      }: {
        children: React.ReactNode;
        name: string;
        onOdsChange: () => void;
        isDisabled: boolean;
        isRequired: boolean;
        onOdsBlur: () => void;
      }) => (
        <select
          onChange={onOdsChange}
          onBlur={onOdsBlur}
          data-disabled={isDisabled}
          data-required={isRequired}
          data-testid={`select-${props.name}`}
          {...props}
        >
          {children}
        </select>
      ),
    ),
  OdsComboboxItem: vi
    .fn()
    .mockImplementation(({ children, ...props }: { children: React.ReactNode }) => (
      <option {...props}>{children}</option>
    )),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  Drawer: vi
    .fn()
    .mockImplementation(
      ({
        children,
        heading,
        primaryButtonLabel,
        onPrimaryButtonClick,
        isPrimaryButtonDisabled,
        isSecondaryButtonDisabled,
        secondaryButtonLabel,
        onSecondaryButtonClick,
        ...props
      }: DrawerProps) => (
        <section data-testid={'drawer'} {...props}>
          <h2>{heading}</h2>
          {children}
          <button onClick={onPrimaryButtonClick} data-disabled={isPrimaryButtonDisabled}>
            {primaryButtonLabel}
          </button>
          <button onClick={onSecondaryButtonClick} data-disabled={isSecondaryButtonDisabled}>
            {secondaryButtonLabel}
          </button>
        </section>
      ),
    ),
}));

const {
  useBaremetalsListMock,
  useBackupVSPCTenantAgentDownloadLinkMock,
  useAddConfigurationVSPCTenantAgentMock,
  useQueryMock,
} = vi.hoisted(() => ({
  useBaremetalsListMock: vi
    .fn()
    .mockReturnValue({ flattenData: undefined, isPending: true, isError: false }),
  useBackupVSPCTenantAgentDownloadLinkMock: vi.fn(),
  useAddConfigurationVSPCTenantAgentMock: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
  useQueryMock: vi.fn().mockReturnValue({ data: new Set(), isPending: false, isError: false }),
}));

vi.mock('@/data/hooks/tenants/useVspcTenants', () => ({
  useVSPCTenantsOptions: vi.fn().mockReturnValue({}),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: useQueryMock,
}));

vi.mock('@/data/hooks/baremetal/useBaremetalsList', () => {
  return {
    useBaremetalsList: useBaremetalsListMock,
  };
});

vi.mock('@/data/hooks/agents/postAgent', () => {
  return {
    useAddConfigurationVSPCTenantAgent: useAddConfigurationVSPCTenantAgentMock,
  };
});

vi.mock('@/data/hooks/agents/getDownloadLinkAgent', () => {
  return {
    useBackupVSPCTenantAgentDownloadLink: useBackupVSPCTenantAgentDownloadLinkMock,
  };
});

vi.mock('@/hooks/useRequiredParams', () => {
  return {
    useRequiredParams: vi.fn().mockReturnValue({
      tenantId: TENANTS_MOCKS[0]!.id,
    }),
  };
});

const getSelectServer = () => screen.getByTestId('select-server');
const getSelectOs = () => screen.getByTestId('select-os');

describe('FirstOrderFormComponent', () => {
  it.each([[true], [false]])(
    'renders onboarding and expected disabled if no baremetal : $expectedDisabled',
    async (isPendingMock) => {
      useBaremetalsListMock.mockReturnValue({
        flattenData: BAREMETALS_MOCK,
        isPending: isPendingMock,
        isError: false,
      });
      useBackupVSPCTenantAgentDownloadLinkMock.mockReturnValue({
        data: mockAgentDownloadLinks.linuxUrl,
        isPending: false,
      });

      render(<AddConfigurationPage />);

      await waitFor(
        () => expect(getSelectServer()).toHaveAttribute('data-disabled', `${isPendingMock}`),
        { timeout: 1000 },
      );
    },
  );

  it('renders onboarding and expected generate order link', async () => {
    useBaremetalsListMock.mockReturnValue({
      flattenData: BAREMETALS_MOCK,
      isPending: false,
      isError: false,
    });
    useBackupVSPCTenantAgentDownloadLinkMock.mockReturnValue({
      data: mockAgentDownloadLinks.linuxUrl,
      isPending: false,
    });
    const user = userEvent.setup();

    render(<AddConfigurationPage />);

    await waitFor(() => expect(getSelectServer().children.length).toBe(BAREMETALS_MOCK.length));
    await waitFor(() => expect(getSelectOs().children.length).toBe(Object.keys(OS_LABELS).length));

    await user.click(screen.getByRole('button', { name: `translated_${NAMESPACES.ACTIONS}:add` }));

    await waitFor(() =>
      expect(screen.getAllByText(`translated_${NAMESPACES.FORM}:required_field`).length).toBe(2),
    );

    await waitFor(() => expect(getSelectServer()).toHaveAttribute('data-disabled', 'false'), {
      timeout: 1000,
    });
    await user.selectOptions(getSelectServer(), ['baremetal-server-1']);
    await user.selectOptions(getSelectOs(), ['WINDOWS']);

    await waitFor(
      () =>
        expect(
          screen.queryByText(`translated_${NAMESPACES.FORM}:error_required_field`),
        ).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });
});
