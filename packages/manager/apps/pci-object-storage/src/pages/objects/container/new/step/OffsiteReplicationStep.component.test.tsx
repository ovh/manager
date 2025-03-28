import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useCatalog, useProductAvailability } from '@ovh-ux/manager-pci-common';
import { useParams } from 'react-router-dom';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { OffsiteReplication } from './OffsiteReplicationStep.component';
import { wrapper } from '@/wrapperRenders';
import { useContainerCreationStore } from '../useContainerCreationStore';

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    OdsRadio: vi.fn().mockImplementation((props) => {
      const {
        value,
        'data-testid': dataTestId,
        name,
        inputId,
        isChecked,
        onOdsChange,
      } = props;

      return (
        <div
          data-testid={dataTestId}
          data-value={value}
          data-name={name}
          data-inputid={inputId}
          is-checked={isChecked ? 'true' : 'false'} // Set is-checked as a string
          onClick={() => onOdsChange?.()}
        >
          Mock OdsRadio
        </div>
      );
    }),
  };
});

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

describe('OffsiteReplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();

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
          availabilityZones: [],
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
    expect(screen.getByTestId('ods-skeleton')).toBeInTheDocument();
  });

  it('allows toggling offsite replication', () => {
    render(<OffsiteReplication />, { wrapper });

    const enableRadio = screen.getByTestId('replication_enabled');
    const disableRadio = screen.getByTestId('replication_disabled');

    expect(disableRadio).toHaveAttribute('is-checked', 'true');
    expect(enableRadio).toHaveAttribute('is-checked', 'false');
  });

  it('displays the correct price estimation', () => {
    render(<OffsiteReplication />, { wrapper });

    expect(
      screen.getByTestId('replication_price_estimation'),
    ).toBeInTheDocument();
  });
});
