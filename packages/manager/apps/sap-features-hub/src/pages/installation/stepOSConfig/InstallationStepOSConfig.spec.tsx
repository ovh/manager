import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import InstallationStepOSConfig from './InstallationStepOSConfig.page';
import { InstallationFormContextProvider } from '@/context/InstallationForm.context';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ stepId: '1' }),
}));

describe('InstallationStepOSConfig page unit test suite', () => {
  it('should render field with correct titles and inputs', () => {
    const { getByText } = render(
      <InstallationFormContextProvider>
        <InstallationStepOSConfig />
      </InstallationFormContextProvider>,
    );

    const elements = [
      'os_config_title',
      'os_config_subtitle',
      'os_config_input_domain',
      'os_config_input_suse',
      'os_config_toggle_update',
      'os_config_toggle_firewall_service',
      'os_config_toggle_firewall_server',
      'os_config_toggle_firewall_database',
    ];

    elements.forEach((element) => expect(getByText(element)).toBeVisible());
  });
});
