import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCatalog, useProductAvailability } from '@ovh-ux/manager-pci-common';
import { useParams } from 'react-router-dom';

import { StepComponent } from '@ovh-ux/manager-react-components';
import { OffsiteReplication } from './OffsiteReplicationStep.component';
import { wrapper } from '@/wrapperRenders';
import { useContainerCreationStore } from '../useContainerCreationStore';

const mocks = vi.hoisted(() => ({
  useMe: vi.fn(() => ({
    me: {
      ovhSubsidiary: 'FR',
      currency: {
        code: 'EUR',
      },
    },
  })),
  t: vi.fn((key) => key),
}));
vi.mock('./useMe', () => ({
  useMe: mocks.useMe,
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mocks.t,
    i18n: { exists: () => true, language: 'fr_FR' },
  }),
}));

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useCatalog: vi.fn(),
  useProductAvailability: vi.fn(),
}));
vi.mock('@ovh-ux/manager-react-components', async () => {
  const { StepComponent: ActualStepComponent, ...rest } = await vi.importActual(
    '@ovh-ux/manager-react-components',
  );
  return {
    ...rest,
    useMe: vi.fn(),
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
    useCatalogPrice: vi.fn().mockImplementation(() => ({
      getFormattedCatalogPrice: vi.fn().mockImplementation((param) => param),
    })),
  };
});

vi.mock('../useContainerCreationStore', () => ({
  useContainerCreationStore: vi.fn(() => ({
    setState: vi.fn(),
    getState: vi.fn(() => ({
      form: { offsiteReplication: false },
      setOffsiteReplication: vi.fn(),
      editOffsiteReplication: vi.fn(),
      submitOffsiteReplication: vi.fn(),
    })),
  })),
}));

describe('OffsiteReplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.t.mockRestore();
    (useParams as jest.Mock).mockReturnValue({ projectId: '123' });

    (useCatalog as jest.Mock).mockReturnValue({
      data: {
        addons: [
          { planCode: 'offsite-replication', pricings: [{ price: 0.02 }] },
        ],
      },
      isPending: false,
    });

    (useProductAvailability as jest.Mock).mockReturnValue({
      data: {
        plans: [
          {
            code: 'storage-standard-region',
            regions: [{ type: 'region-3-az' }],
          },
        ],
      },
      isPending: false,
    });

    useContainerCreationStore.setState({
      form: {
        offer: '',
        deploymentMode: '',
        region: {
          continentCode: 'EU',
          datacenter: 'test',
          enabled: true,
          name: 'test',
          type: 'region',
        },
        ownerId: 123,
        offsiteReplication: false,
        versioning: false,
        encryption: '',
        containerName: '',
        containerType: '',
      },
      stepper: {
        offer: { isOpen: false, isChecked: false, isLocked: false },
        deployment: { isOpen: false, isChecked: false, isLocked: false },
        region: { isOpen: false, isChecked: false, isLocked: false },
        offsiteReplication: { isOpen: true, isChecked: false, isLocked: false },
        versioning: { isOpen: false, isChecked: false, isLocked: false },
        ownerId: { isOpen: false, isChecked: false, isLocked: false },
        encryption: { isOpen: false, isChecked: false, isLocked: false },
        containerName: { isOpen: false, isChecked: false, isLocked: false },
        containerType: { isOpen: false, isChecked: false, isLocked: false },
      },
      setOffsiteReplication: vi.fn(),
      submitOffsiteReplication: vi.fn(),
      editOffsiteReplication: vi.fn(),
    });
  });

  it('renders the component', () => {
    render(<OffsiteReplication />, { wrapper });
    expect(
      screen.getByText(
        'pci_projects_project_storages_containers_offsite_replication_title',
      ),
    ).toBeInTheDocument();
  });

  it('displays the loading skeleton while fetching data', () => {
    (useCatalog as jest.Mock).mockReturnValue({ data: null, isPending: true });
    (useProductAvailability as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<OffsiteReplication />, { wrapper });

    expect(
      screen.getByText(
        'pci_projects_project_storages_containers_offsite_replication_title',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('ods-skeleton')).toBeInTheDocument(); // Assuming OdsSkeleton has data-testid
  });

  it('allows toggling offsite replication', async () => {
    render(<OffsiteReplication />, { wrapper });

    const enableRadio = screen.getByTestId('replication_enabled');

    const disableRadio = screen.getByTestId('replication_disabled');

    expect(disableRadio).toHaveAttribute('is-checked', 'true');
    expect(enableRadio).toHaveAttribute('is-checked', 'false');

    const mockSetOffsiteReplication = useContainerCreationStore()
      .setOffsiteReplication;

    // Click enable radio
    fireEvent.click(enableRadio);

    await waitFor(() => {
      expect(mockSetOffsiteReplication).toHaveBeenCalledWith(true);
    });

    // Click disable radio
    fireEvent.click(disableRadio);

    await waitFor(() => {
      expect(mockSetOffsiteReplication).toHaveBeenCalledWith(false);
    });
  });

  it('displays the correct price estimation', () => {
    render(<OffsiteReplication />, { wrapper });

    expect(
      screen.getByText(
        /pci_projects_project_storages_containers_offsite_replication_price_estimation/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /pci_projects_project_storages_containers_offsite_replication_final_price_estimation_value/,
      ),
    ).toBeInTheDocument();
  });

  it('calls submitOffsiteReplication when clicking "Next"', () => {
    render(<OffsiteReplication />, { wrapper });

    fireEvent.click(
      screen.getByText('pci-common:common_stepper_next_button_label'),
    );
    expect(
      useContainerCreationStore.getState().submitOffsiteReplication,
    ).toHaveBeenCalled();
  });

  it('calls editOffsiteReplication when clicking "Modify"', () => {
    render(<OffsiteReplication />, { wrapper });

    fireEvent.click(
      screen.getByText('pci-common:common_stepper_modify_this_step'),
    );
    expect(
      useContainerCreationStore.getState().editOffsiteReplication,
    ).toHaveBeenCalled();
  });
});
