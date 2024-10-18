import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import { AddressesCell } from './AddressesCell.component';
import { TAddress } from '@/data/hooks/instance/useInstances';

const addresses: TAddress[] = [
  {
    ip: '123456',
    version: 1,
    gatewayIp: '',
  },
  {
    ip: '78910',
    version: 2,
    gatewayIp: '',
  },
];

describe('Considering the AddressesCell component', () => {
  test('Should render the component with given addresses', () => {
    render(<AddressesCell isLoading={false} addresses={addresses} />);
    addresses.forEach((address) => {
      expect(screen.getByText(address.ip)).toBeInTheDocument();
    });
  });
});
