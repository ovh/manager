import { describe, expect, it, vi } from 'vitest';

import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';

import { renderWithShellContext } from '@/__mocks__/ShellContextWrapper';
import { FourServices } from '@/__mocks__/billingServices';

import ServicesActions from './ServicesActions.component';

const [serviceResiliated] = FourServices.services;
const autoRenewLink = 'https://www.autorenewlink.com/';
const trackingPrefix = ['a tracking prefix'];

const trackingSpy = vi.fn();

const shellContext = {
  shell: { navigation: {} },
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
};

const renderComponent = () =>
  renderWithShellContext(
    <ServicesActions
      service={serviceResiliated}
      autoRenewLink={autoRenewLink}
      trackingPrefix={trackingPrefix}
    />,
    shellContext as ShellContextType,
  );

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackingSpy,
    }),
  };
});

describe('ServicesActions W3C Validation', () => {
  it('should have a valid html for service Resiliated', () => {
    const { container } = renderComponent();

    void expect(container.innerHTML).toBeValidHtml();
  });
});
