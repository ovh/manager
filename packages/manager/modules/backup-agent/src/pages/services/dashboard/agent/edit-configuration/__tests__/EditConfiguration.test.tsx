import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { queryKeys } from '@/data/queries/queryKeys';
import { mockAgents } from '@/mocks/agents/agents';
import { mockTenantBackupPolicies } from '@/mocks/tenant/backupPolicies.mock';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { EditConfigurationPage } from '@/pages/services/dashboard/agent/edit-configuration/EditConfiguration.page';
import { useParamsMock } from '@/test-utils/mocks/react-router-dom';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  const { LinkMock, useNavigateMock, useParamsMock } = await import(
    '@/test-utils/mocks/react-router-dom'
  );
  return {
    ...actual,
    useParams: useParamsMock,
    useNavigate: useNavigateMock,
    Link: LinkMock,
  };
});

// --- Mock translation ---
vi.mock('react-i18next', async () => {
  const { useTranslationMock } = await import('@/test-utils/mocks/react-i18next');
  return {
    useTranslation: useTranslationMock,
  };
});

// --- Mock ODS ---
vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
  const {
    OdsTextMock,
    OdsButtonMock,
    OdsFormFieldMock,
    OdsInputMock,
    OdsSelectMock,
    OdsComboboxMock,
    OdsComboboxItemMock,
    OdsSpinnerMock,
    OdsMessageMock,
  } = await import('@/test-utils/mocks/ods-components');
  return {
    ...actual,
    OdsText: OdsTextMock,
    OdsButton: OdsButtonMock,
    OdsFormField: OdsFormFieldMock,
    OdsInput: OdsInputMock,
    OdsSelect: OdsSelectMock,
    OdsCombobox: OdsComboboxMock,
    OdsComboboxItem: OdsComboboxItemMock,
    OdsSpinner: OdsSpinnerMock,
    OdsMessage: OdsMessageMock,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  const { DrawerMock, useNotificationsMock } = await import(
    '@/test-utils/mocks/manager-react-components'
  );
  return {
    ...actual,
    Drawer: DrawerMock,
    useNotifications: useNotificationsMock,
  };
});

const { useEditConfigurationVSPCTenantAgentMock, getBackupAgentsDetailsMock } = vi.hoisted(() => ({
  useEditConfigurationVSPCTenantAgentMock: vi
    .fn()
    .mockReturnValue({ isPending: false, mutate: vi.fn() }),
  getBackupAgentsDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/useEditConfigurationVSPCTenantAgent', () => ({
  useEditConfigurationVSPCTenantAgent: useEditConfigurationVSPCTenantAgentMock,
}));

vi.mock('@/data/api/agents/agents.requests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/api/agents/agents.requests')>();
  return {
    ...actual,
    getBackupAgentsDetails: getBackupAgentsDetailsMock,
  };
});

const getUnableEditAgentNotEnabledBanner = () =>
  screen.queryByText('translated_unable_edit_agent_not_enabled');

const getInputName = () =>
  screen.getByRole('textbox', {
    name: 'translated_name',
  });
const getInputServiceName = () => screen.getByRole('textbox', { name: 'translated_service' });
const getInputIp = () =>
  screen.getByRole('textbox', {
    name: 'translated_address_ip',
  });
const getSelectPolicy = () => screen.getByTestId('select-policy');

const getSubmitButton = () => screen.getByRole('button', { name: `translated_edit` });

describe('EditConfigurationComponent', () => {
  let queryClient: QueryClient;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeAll(() => {
    useParamsMock.mockReturnValue({ tenantId: TENANTS_MOCKS[0]!.id, agentId: mockAgents[0]!.id });
  });

  beforeEach(() => {
    queryClient = createQueryClientTest();
  });

  it('renders edit configuration component and see default value', async () => {
    const mutateMock = vi.fn();
    useEditConfigurationVSPCTenantAgentMock.mockReturnValue({
      isPending: false,
      mutate: mutateMock,
    });
    getBackupAgentsDetailsMock.mockResolvedValue(mockAgents[0]!);

    queryClient.setQueryData(queryKeys.agents.detail(mockAgents[0]!.id), mockAgents[0]!);
    queryClient.setQueryData(queryKeys.tenants.vspc.policies(), mockTenantBackupPolicies);
    // Seed dependencies for ensureQueryData resolution during refetch
    queryClient.setQueryData(queryKeys.backupServices.all, [{ id: 'backup-service-id' }]);
    queryClient.setQueryData(queryKeys.tenants.vspc.all(), [TENANTS_MOCKS[0]!]);

    const wrapper = await buildWrapper();

    const user = userEvent.setup();

    render(<EditConfigurationPage />, { wrapper });

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
      backupAgentId: mockAgents[0]!.id,
    });
  });

  it('renders edit configuration component and see banner because agent is not enabled', async () => {
    queryClient.setQueryData(queryKeys.agents.detail(mockAgents[0]!.id), {
      ...mockAgents[0]!,
      status: 'NOT_CONFIGURED',
    });

    const wrapper = await buildWrapper();

    render(<EditConfigurationPage />, { wrapper });

    expect(getUnableEditAgentNotEnabledBanner()).toBeVisible();
    expect(getSubmitButton()).toBeDisabled();
  });

  it('renders edit configuration loading drawer component', async () => {
    // Don't seed agent data — query stays in loading state

    const wrapper = await buildWrapper();

    render(<EditConfigurationPage />, { wrapper });

    screen.getByRole('heading', {
      name: `translated_edit_configuration`,
      level: 2,
    });

    expect(screen.queryAllByRole('textbox').length).toBe(0);

    screen.getByRole('button', { name: `translated_edit` });
  });
});
