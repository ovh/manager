import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InstallationStepServerConfig from './InstallationStepServerConfig.page';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ stepId: '1' }),
}));

const renderComponent = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InstallationFormContextProvider>
        <InstallationStepServerConfig />
      </InstallationFormContextProvider>
    </QueryClientProvider>,
  );

describe('InstallationStepServerConfig page unit test suite', () => {
  it('should render field with correct titles and inputs', () => {
    const { getByText } = renderComponent();

    const elements = [
      'server_config_title',
      'server_config_subtitle',
      'server_config_input_vmware_ports',
      'server_config_input_subnet_mask',
      'server_config_input_gateway_ip',
      'server_config_input_thick_storage',
      'server_config_toggle_password_encryption',
    ];

    elements.forEach((element) => expect(getByText(element)).toBeVisible());
  });
});
