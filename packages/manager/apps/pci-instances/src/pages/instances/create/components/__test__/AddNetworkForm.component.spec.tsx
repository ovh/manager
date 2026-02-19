import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddNetworkForm from '../network/AddNetworkForm.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { getPrivateNetworks } from '@/data/api/privateNetworks';
import { mockedPrivateNetworkEntity } from '@/__mocks__/instance/constants';
import { TPrivateNetwork } from '@/domain/entities/configuration';
import { format } from 'date-fns';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { TDeploymentModeID } from '@/domain/entities/instancesCatalog';
import { networkSchema } from '../../CreateInstance.schema';

const getPrivateNetworksMock = vi.fn();
const useInstancesCatalogWithSelectMock = vi.fn();

vi.mock('@/data/api/privateNetworks');
vi.mocked(getPrivateNetworks).mockImplementation(getPrivateNetworksMock);

vi.mock('@/data/hooks/catalog/useInstancesCatalogWithSelect');
vi.mocked(useInstancesCatalogWithSelect).mockImplementation(
  useInstancesCatalogWithSelectMock,
);

const setupTest = (
  {
    networks,
    deploymentMode,
  }: {
    networks: TPrivateNetwork | null;
    deploymentMode?: TDeploymentModeID;
  } = {
    networks: mockedPrivateNetworkEntity,
  },
) => {
  getPrivateNetworksMock.mockReturnValue(networks);
  useInstancesCatalogWithSelectMock.mockReturnValue({
    data: deploymentMode ?? 'region',
  });

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        microRegion: 'BHS5',
      }}
    >
      <AddNetworkForm />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering AddNetwork component', () => {
  it('should display pre filled ovh private network as form default value', async () => {
    setupTest();

    const formattedDate = format(new Date(), 'ddMMyyyy');

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_name_label_form',
        ),
      ).toHaveValue(`pn-BHS5-${formattedDate}`);

      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_vlanID_label_form',
        ),
      ).toHaveValue(1);

      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_cidr_label_form',
        ),
      ).toHaveValue(`10.${1 % 255}.0.0/16`);
    });
  });

  it('should invalidate private name field when it is empty', async () => {
    setupTest();

    const input = await screen.findByLabelText(
      'creation:pci_instance_creation_network_add_new_name_label_form',
    );

    await userEvent.clear(input);

    await waitFor(() => {
      expect(input).toBeInvalid();
      expect(
        screen.getByText(`${NAMESPACES.FORM}:error_required_field`),
      ).toBeVisible();
    });
  });

  it('should invalidate private name field when it is more than 255 characters', async () => {
    setupTest();

    const input = await screen.findByLabelText(
      'creation:pci_instance_creation_network_add_new_name_label_form',
    );

    await userEvent.type(input, 'abc'.repeat(134));

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it('should display warning message when vlanId is already used', async () => {
    setupTest();

    const input = await screen.findByLabelText(
      'creation:pci_instance_creation_network_add_new_vlanID_label_form',
    );

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
      ),
    ).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 2100 } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
        ),
      ).toBeVisible();
    });
  });

  it('should display warning message when vlanId = 0', async () => {
    setupTest();

    const input = await screen.findByLabelText(
      'creation:pci_instance_creation_network_add_new_vlanID_label_form',
    );

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_network_add_new_vlanID_warning',
      ),
    ).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 0 } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_add_new_vlanID_warning',
        ),
      ).toBeVisible();
    });
  });

  it('should invalidate vlanId field when value is greater than 4000', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_vlanID_label_form',
    );

    fireEvent.change(input, { target: { value: 5000 } });

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it('should invalidate cidr field when value is not formatted as a ip/mask', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_cidr_label_form',
    );

    fireEvent.change(input, { target: { value: 'fake-cidr' } });

    await waitFor(() => {
      expect(input).toBeInvalid();
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_add_new_cidr_error',
        ),
      ).toBeVisible();
    });
  });

  it('should invalidate cidr field when it is empty', async () => {
    setupTest();

    const input = await screen.findByLabelText(
      'creation:pci_instance_creation_network_add_new_cidr_label_form',
    );

    await userEvent.clear(input);

    expect(input).toBeInvalid();
  });

  it('should checked by default the dhcp field', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_dhcp_label_form',
        ),
      ).toBeChecked();
    });
  });

  it('should not display vlanId field when deployment mode is localzone', async () => {
    setupTest({
      networks: mockedPrivateNetworkEntity,
      deploymentMode: 'localzone',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_name_label_form',
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByLabelText(
        'creation:pci_instance_creation_network_add_new_vlanID_label_form',
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_cidr_label_form',
      ),
    ).toBeInTheDocument();
  });

  it('should display vlanId field when deployment mode is region', async () => {
    setupTest({
      networks: mockedPrivateNetworkEntity,
      deploymentMode: 'region',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_vlanID_label_form',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should display vlanId field when deployment mode is region-3-az', async () => {
    setupTest({
      networks: mockedPrivateNetworkEntity,
      deploymentMode: 'region-3-az',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_vlanID_label_form',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should not display vlanId warnings when deployment mode is localzone', async () => {
    setupTest({
      networks: mockedPrivateNetworkEntity,
      deploymentMode: 'localzone',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'creation:pci_instance_creation_network_add_new_name_label_form',
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_network_add_new_vlanID_warning',
      ),
    ).not.toBeInTheDocument();
  });
});

describe('networkSchema vlanId validation', () => {
  const validNetwork = {
    name: 'test-network',
    cidr: '10.1.0.0/16',
    enableDhcp: true,
  };

  it('should accept null vlanId', () => {
    const result = networkSchema.safeParse({
      ...validNetwork,
      vlanId: null,
    });
    expect(result.success).toBe(true);
  });

  it('should accept valid numeric vlanId', () => {
    const result = networkSchema.safeParse({
      ...validNetwork,
      vlanId: 100,
    });
    expect(result.success).toBe(true);
  });

  it('should reject vlanId greater than 4000', () => {
    const result = networkSchema.safeParse({
      ...validNetwork,
      vlanId: 5000,
    });
    expect(result.success).toBe(false);
  });
});
