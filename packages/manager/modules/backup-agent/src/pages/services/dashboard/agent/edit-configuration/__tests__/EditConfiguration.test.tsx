import React, { ComponentProps } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { OdsInput } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DrawerProps } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { mockAgents } from '@/mocks/agents/agents';
import { mockTenantBackupPolicies } from '@/mocks/tenant/backupPolicies.mock';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { EditConfigurationPage } from '@/pages/services/dashboard/agent/edit-configuration/EditConfiguration.page';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useParams: vi
      .fn()
      .mockReturnValue({ tenantId: TENANTS_MOCKS[0]!.id, agentId: mockAgents[0]!.id }),
    useNavigate: () => ({ navigate: vi.fn() }),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `translated_${key}`,
  }),
}));

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-components/react');

  return {
    ...actual,
    OdsText: vi
      .fn()
      .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
    OdsButton: vi
      .fn()
      .mockImplementation(
        ({
          label,
          isDisabled,
          ...props
        }: {
          children: React.ReactNode;
          isDisabled: boolean;
          label: string;
        }) => (
          <button {...props} disabled={isDisabled}>
            {label}
          </button>
        ),
      ),
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
    OdsInput: vi
      .fn()
      .mockImplementation(
        ({
          onOdsChange,
          onOdsBlur,
          ...props
        }: Pick<ComponentProps<typeof OdsInput>, 'onOdsChange' | 'onOdsBlur'>) => (
          <input onChange={onOdsChange as () => void} onBlur={onOdsBlur as () => void} {...props} />
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
    OdsComboboxItem: vi
      .fn()
      .mockImplementation(({ children, ...props }: { children: React.ReactNode }) => (
        <option {...props}>{children}</option>
      )),
  };
});

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
          <button onClick={onPrimaryButtonClick} disabled={isPrimaryButtonDisabled}>
            {primaryButtonLabel}
          </button>
          <button onClick={onSecondaryButtonClick} disabled={isSecondaryButtonDisabled}>
            {secondaryButtonLabel}
          </button>
        </section>
      ),
    ),
  useNotifications: vi.fn().mockReturnValue({
    useSuccess: vi.fn(),
  }),
}));

const {
  useBackupTenantPoliciesMock,
  useBackupVSPCTenantAgentDetailsMock,
  useEditConfigurationVSPCTenantAgentMock,
} = vi.hoisted(() => ({
  useBackupTenantPoliciesMock: vi
    .fn()
    .mockReturnValue({ data: undefined, isLoading: true, isError: false }),
  useEditConfigurationVSPCTenantAgentMock: vi
    .fn()
    .mockReturnValue({ isPending: false, mutate: vi.fn() }),
  useBackupVSPCTenantAgentDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/agents/getAgentDetails', () => ({
  useBackupVSPCTenantAgentDetails: useBackupVSPCTenantAgentDetailsMock,
}));

vi.mock('@/data/hooks/agents/putAgent', () => ({
  useEditConfigurationVSPCTenantAgent: useEditConfigurationVSPCTenantAgentMock,
}));

vi.mock('@/data/hooks/tenants/useVspcTenantBackupPolicies', () => ({
  useBackupTenantPolicies: useBackupTenantPoliciesMock,
}));

const getUnableEditAgentNotEnabledBanner = () =>
  screen.queryByText('translated_unable_edit_agent_not_enabled');

const getInputName = () =>
  screen.getByRole('textbox', {
    name: 'translated_@ovh-ux/manager-common-translations/dashboard:name',
  });
const getInputServiceName = () => screen.getByRole('textbox', { name: 'translated_service' });
const getInputIp = () =>
  screen.getByRole('textbox', {
    name: 'translated_@ovh-ux/manager-common-translations/system:address_ip',
  });
const getSelectPolicy = () => screen.getByTestId('select-policy');

const getSubmitButton = () =>
  screen.getByRole('button', { name: `translated_${NAMESPACES.ACTIONS}:edit` });

describe('EditConfigurationComponent', () => {
  beforeAll(() => {
    useBackupVSPCTenantAgentDetailsMock.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockAgents[0]!,
      refetch: vi.fn().mockResolvedValue({ data: mockAgents[0]! }),
    });
  });

  it('renders edit configuration component and see default value', async () => {
    const mutateMock = vi.fn();
    useEditConfigurationVSPCTenantAgentMock.mockReturnValue({
      isPending: false,
      mutate: mutateMock,
    });

    useBackupTenantPoliciesMock.mockReturnValue({
      data: mockTenantBackupPolicies,
      isLoading: false,
      isError: false,
      isSuccess: true,
    });
    const user = userEvent.setup();

    render(<EditConfigurationPage />);

    expect(getUnableEditAgentNotEnabledBanner()).not.toBeInTheDocument();

    await waitFor(() =>
      expect(getSelectPolicy().children.length).toBe(mockTenantBackupPolicies.length),
    );

    expect(getInputName()).toHaveValue(mockAgents[0]!.currentState.name);
    expect(getInputServiceName()).toHaveValue(mockAgents[0]!.currentState.productResourceName);
    expect(getInputIp()).toHaveValue(mockAgents[0]!.currentState.ips.join(', '));
    expect(getSelectPolicy()).toHaveValue(mockAgents[0]!.currentState.policy);

    await user.click(getSubmitButton());
    expect(mutateMock).toHaveBeenCalledWith({
      displayName: mockAgents[0]!.currentState.name,
      ips: mockAgents[0]!.currentState.ips,
      policy: mockAgents[0]!.currentState.policy,
      vspcTenantId: TENANTS_MOCKS[0]!.id,
      backupAgentId: mockAgents[0]!.id,
    });
  });

  it('renders edit configuration component and see banner because agent is not enabled', () => {
    useBackupVSPCTenantAgentDetailsMock.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { ...mockAgents[0]!, status: 'NOT_CONFIGURED' },
      refetch: vi.fn().mockResolvedValue({ data: {} }),
    });

    render(<EditConfigurationPage />);

    expect(getUnableEditAgentNotEnabledBanner()).toBeVisible();
    expect(getSubmitButton()).toBeDisabled();
  });

  it('renders edit configuration loading drawer component', () => {
    useBackupVSPCTenantAgentDetailsMock.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      refetch: vi.fn().mockResolvedValue({ data: {} }),
    });

    render(<EditConfigurationPage />);

    screen.getByRole('heading', {
      name: `translated_${BACKUP_AGENT_NAMESPACES.AGENT}:edit_configuration`,
      level: 2,
    });

    expect(screen.queryAllByRole('textbox').length).toBe(0);

    screen.getByRole('button', { name: `translated_${NAMESPACES.ACTIONS}:edit` });
  });
});
