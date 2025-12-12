import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import Network from '../Network.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { mockedPrivateNetworks } from '@/__mocks__/instance/constants';
import { UseFormReturn } from 'react-hook-form';
import { selectPrivateNetworks } from '../../view-models/networksViewModel';

const selectPrivateNetworksMock = vi.fn();

vi.mock('react-hook-form', async (importOriginal) => {
  const original: typeof import('react-hook-form') = await importOriginal();

  return {
    ...original,
    useFormContext: () =>
      (({
        control: vi.fn(),
        setValue: vi.fn(),
      } as unknown) as UseFormReturn),
    useWatch: () => mockedPrivateNetworks[0]?.value,
  };
});

vi.mock('../../view-models/networksViewModel');
vi.mocked(selectPrivateNetworks).mockImplementation(selectPrivateNetworksMock);

describe('Considering Network component', () => {
  it('should not display neither the dropdown nor the create private network button when networks have not yet exists', () => {
    selectPrivateNetworksMock.mockReturnValue([]);
    renderWithMockedWrappers(<Network />);

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_select_network_dropdown_label',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('creation:pci_instance_creation_network_add_new'),
    ).not.toBeInTheDocument();
  });

  it('should display dropdown and select the first existing network when it exists', async () => {
    selectPrivateNetworksMock.mockReturnValue(mockedPrivateNetworks);
    renderWithMockedWrappers(<Network />);

    const defaultNetwork = mockedPrivateNetworks[0];

    const options = screen.getAllByText(defaultNetwork!.label);
    const optionWithValue = options.find((option) =>
      option.hasAttribute('selected'),
    );

    mockedPrivateNetworks.forEach(({ label, value }) => {
      const options = screen.getAllByText(label);
      const optionWithValue = options.find(
        (option) => option.getAttribute('value') === value,
      );

      expect(optionWithValue).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_select_network_dropdown_label',
        ),
      ).toBeVisible();
      expect(optionWithValue).toHaveValue(defaultNetwork!.value);
    });
  });

  it('should display create new Private Network button when networks exists', () => {
    selectPrivateNetworksMock.mockReturnValue(mockedPrivateNetworks);
    renderWithMockedWrappers(<Network />);

    expect(
      screen.getByText('creation:pci_instance_creation_network_add_new'),
    ).toBeVisible();
  });
});
