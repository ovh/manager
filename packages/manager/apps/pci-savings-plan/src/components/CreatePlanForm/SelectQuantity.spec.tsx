import React from 'react';
import { vi } from 'vitest';
import SelectQuantity, { SelectQuantityProps } from './SelectQuantity';
import { render } from '@/utils/testProvider';

const defaultProps: SelectQuantityProps = {
  isInstance: true,
  quantity: 1,
  handleQuantityChange: () => {},
};

vi.mock('@ovh-ux/manager-pci-common', () => ({
  usePciUrl: () => ({
    getUrl: () => 'https://www.ovh.com',
  }),
}));

const setupSpecTest = (props: SelectQuantityProps = defaultProps) =>
  render(<SelectQuantity {...props} />);

describe('SelectQuantity', () => {
  describe('when isInstance is true', () => {
    it('should render the quantity_banner_instance', () => {
      const screen = setupSpecTest();

      const instanceBanner = screen.getByText(/quantity_banner_instance/i);
      expect(instanceBanner).toBeInTheDocument();
    });
  });
});
