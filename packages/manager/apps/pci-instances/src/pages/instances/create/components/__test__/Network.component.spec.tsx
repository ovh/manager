import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import Network from '../Network.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { mockedPrivateNetworks } from '@/__mocks__/instance/constants';

describe('Considering NetworkSelector component', () => {
  it('should display network dropdown when private networks already exists', () => {
    renderWithMockedWrappers(<Network />);

    expect(
      screen.getByText(
        'creation:pci_instance_creation_select_network_dropdown_label',
      ),
    ).toBeVisible();

    mockedPrivateNetworks.forEach(({ label, value }) => {
      const options = screen.getAllByText(label);
      const optionWithValue = options.find(
        (option) => option.getAttribute('value') === value,
      );

      expect(optionWithValue).toBeInTheDocument();
    });
  });

  it('should select by default the first existing private network', () => {
    renderWithMockedWrappers(<Network />);

    const defaultNetwork = mockedPrivateNetworks[0];

    const options = screen.getAllByText(defaultNetwork!.label);
    const optionWithValue = options.find((option) =>
      option.hasAttribute('selected'),
    );

    expect(optionWithValue).toHaveValue(defaultNetwork!.value);
  });
});
