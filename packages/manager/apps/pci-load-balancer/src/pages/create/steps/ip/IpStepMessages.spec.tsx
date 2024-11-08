import { describe, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import { render, renderHook, within } from '@testing-library/react';
import React from 'react';
import { TFloatingIp } from '@/api/data/floating-ips';
import { IpStepMessages } from '@/pages/create/steps/ip/IpStepMessages';
import { TCreateStore, useCreateStore } from '@/pages/create/store';
import { FLOATING_IP_TYPES } from '@/constants';

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('@ovhcloud/ods-components/react', async () => {
  const { OsdsMessage: ActualOsdsMessage, ...rest } = await vi.importActual(
    '@ovhcloud/ods-components/react',
  );

  const [OsdsMessageElem] = [ActualOsdsMessage as React.ElementType];

  return {
    ...rest,
    OsdsMessage: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsMessageElem {...props} data-testid="osds-message">
        {children}
      </OsdsMessageElem>
    )),
  };
});

const renderComponent = (
  type: typeof FLOATING_IP_TYPES[number] = 'create',
  price = '',
) => render(<IpStepMessages type={type} price={price} />);

describe('IpStepMessages', () => {
  describe('create', () => {
    it("should show info message if the type is 'create'", () => {
      const { getByTestId } = renderComponent('create');

      const message = getByTestId('osds-message');

      expect(message).toBeInTheDocument();
      expect(message.attributes.getNamedItem('type').value).toBe('info');
      expect(message.attributes.getNamedItem('color').value).toBe('info');
      expect(
        within(message).queryByText(
          'load-balancer/create | octavia_load_balancer_create_floating_ip_new_information',
        ),
      ).toBeInTheDocument();

      expect(
        within(message).queryByText(
          'load-balancer/create | octavia_load_balancer_create_floating_ip_new_price',
        ),
      ).toBeInTheDocument();
      expect(
        within(message).queryByText(
          'load-balancer/create | octavia_load_balancer_create_floating_ip_new_price_interval',
        ),
      ).toBeInTheDocument();
    });
  });

  it("should show warning message if the type is 'none'", () => {
    const { getByTestId } = renderComponent('none');
    const message = getByTestId('osds-message');

    expect(message).toBeInTheDocument();
    expect(message.attributes.getNamedItem('type').value).toBe('warning');
    expect(message.attributes.getNamedItem('color').value).toBe('warning');
    expect(
      within(message).queryByText(
        'load-balancer/create | octavia_load_balancer_create_floating_ip_no_floating_ip_information',
      ),
    ).toBeInTheDocument();
  });

  it('should not show the message if the selected ip is ip', () => {
    const { queryByTestId } = renderComponent('ip');

    expect(queryByTestId('osds-message')).not.toBeInTheDocument();
  });
});
