import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { queryKeys } from '@/data/queries/queryKeys';
import { mockAgentDownloadLinks } from '@/mocks/agents/agentDownloadLinks';
import { BAREMETALS_MOCK } from '@/mocks/baremetals/baremetals.mocks';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { OS_LABELS } from '@/module.constants';
import { DrawerMock } from '@/test-utils/mocks/manager-react-components';
import {
  OdsButtonMock,
  OdsCodeMock,
  OdsComboboxItemMock,
  OdsComboboxMock,
  OdsFormFieldMock,
  OdsMessageMock,
  OdsSelectMock,
  OdsTextMock,
} from '@/test-utils/mocks/ods-components';
import { useTranslationMock } from '@/test-utils/mocks/react-i18next';
import { LinkMock, useNavigateMock } from '@/test-utils/mocks/react-router-dom';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import AddConfigurationPage from '../AddConfiguration.page';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: useNavigateMock,
    Link: LinkMock,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: OdsTextMock,
  OdsMessage: OdsMessageMock,
  OdsCode: OdsCodeMock,
  OdsButton: OdsButtonMock,
  OdsFormField: OdsFormFieldMock,
  OdsCombobox: OdsComboboxMock,
  OdsSelect: OdsSelectMock,
  OdsComboboxItem: OdsComboboxItemMock,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  Drawer: DrawerMock,
}));

const { useEnvironmentMock } = vi.hoisted(() => ({
  useEnvironmentMock: vi.fn().mockReturnValue({ getRegion: () => 'EU' }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useEnvironment: useEnvironmentMock,
}));

const { useAddConfigurationVSPCTenantAgentMock } = vi.hoisted(() => ({
  useAddConfigurationVSPCTenantAgentMock: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}));

vi.mock('@/data/hooks/useAddConfigurationVSPCTenantAgent', () => ({
  useAddConfigurationVSPCTenantAgent: useAddConfigurationVSPCTenantAgentMock,
}));

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
  let queryClient: QueryClient;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  const seedCommonData = ({ withBaremetals = true } = {}) => {
    if (withBaremetals) {
      queryClient.setQueryData(queryKeys.baremetals.all, BAREMETALS_MOCK);
    }
    queryClient.setQueryData(queryKeys.tenants.vspc.all(), TENANTS_MOCKS);
    queryClient.setQueryData(queryKeys.agents.downloadLink(), mockAgentDownloadLinks);
  };

  beforeEach(() => {
    queryClient = createQueryClientTest();
    useEnvironmentMock.mockReturnValue({ getRegion: () => 'EU' });
  });

  it.each([[true], [false]])(
    'renders onboarding and expected disabled if no baremetal : $expectedDisabled',
    async (isPendingMock) => {
      seedCommonData({ withBaremetals: !isPendingMock });

      const wrapper = await buildWrapper();

      render(<AddConfigurationPage />, { wrapper });

      await waitFor(
        () => expect(getSelectServer()).toHaveAttribute('data-disabled', `${isPendingMock}`),
        { timeout: 1000 },
      );
    },
  );

  it('renders onboarding and expected generate order link', async () => {
    seedCommonData();

    const wrapper = await buildWrapper();

    const user = userEvent.setup();

    render(<AddConfigurationPage />, { wrapper });

    await waitFor(() => expect(getSelectServer().children.length).toBe(BAREMETALS_MOCK.length));
    await waitFor(() => expect(getSelectOs().children.length).toBe(Object.keys(OS_LABELS).length));

    await user.click(screen.getByRole('button', { name: `translated_add` }));

    await waitFor(() => expect(screen.getAllByText(`translated_required_field`).length).toBe(2));

    await waitFor(() => expect(getSelectServer()).toHaveAttribute('data-disabled', 'false'), {
      timeout: 1000,
    });
    await user.selectOptions(getSelectServer(), ['baremetal-server-1']);
    await user.selectOptions(getSelectOs(), ['WINDOWS']);

    await waitFor(
      () => expect(screen.queryByText(`translated_error_required_field`)).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });

  it('shows only US datacenter servers and the US region note when region is US', async () => {
    useEnvironmentMock.mockReturnValue({ getRegion: () => 'US' });
    seedCommonData();

    const wrapper = await buildWrapper();

    render(<AddConfigurationPage />, { wrapper });

    const usBaremetalsCount = BAREMETALS_MOCK.filter(({ datacenter }) =>
      ['vin', 'hil'].some((prefix) => datacenter.toLowerCase().startsWith(prefix)),
    ).length;

    await waitFor(() => expect(getSelectServer().children.length).toBe(usBaremetalsCount));
    expect(screen.getByText('translated_add_server_us_region_note')).toBeInTheDocument();
  });

  it('does not show the US region note when region is not US', async () => {
    seedCommonData();

    const wrapper = await buildWrapper();

    render(<AddConfigurationPage />, { wrapper });

    await waitFor(() => expect(getSelectServer().children.length).toBe(BAREMETALS_MOCK.length));
    expect(screen.queryByText('translated_add_server_us_region_note')).not.toBeInTheDocument();
  });
});
