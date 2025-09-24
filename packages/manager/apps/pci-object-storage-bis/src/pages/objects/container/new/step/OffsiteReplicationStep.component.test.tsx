import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useCatalog,
  useGetProjectRegions,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { MemoryRouter, useParams } from 'react-router-dom';
import { OffsiteReplication } from './OffsiteReplicationStep.component';
import { wrapperOffsiteReplication } from '@/wrapperRenders';
import { useContainerCreationStore } from '../useContainerCreationStore';

// Mock OvhTracking
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useOvhTracking: () => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    }),
  };
});

// Mock ODS components
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
          data-is-checked={isChecked ? 'true' : 'false'}
          onClick={() => onOdsChange?.()}
        >
          Mock OdsRadio
        </div>
      );
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as Record<string, unknown>),
    useParams: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useCatalog: vi.fn(),
  useProductAvailability: vi.fn(),
  useGetProjectRegions: () => ({ regions: [], isLoading: false }),
}));

vi.mock('@/adapters/hooks/useAllowedRegions', () => ({
  useAllowedRegions: vi.fn().mockReturnValue({
    allowedRegions: [
      {
        name: 'EU-WEST-1',
        datacenter: 'EU-WEST-1',
        continentCode: 'EU',
        type: 'region',
        enabled: true,
        availabilityZones: [],
      },
    ],
    hasRegions: true,
    isPending: false,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    StepComponent: vi
      .fn()
      .mockImplementation(actual.StepComponent as (...args: any) => any),
    useCatalogPrice: vi.fn().mockImplementation(() => ({
      getFormattedCatalogPrice: vi.fn().mockImplementation((param) => param),
    })),
    useTranslatedMicroRegions: vi.fn().mockReturnValue({
      translateMicroRegion: vi.fn().mockImplementation((name) => name),
      translateContinentRegion: vi.fn().mockImplementation((name) => name),
    }),
  };
});

describe('OffsiteReplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ projectId: '123' });

    (useCatalog as jest.Mock).mockReturnValue({
      data: {
        addons: [
          {
            planCode: 'offsite-replication',
            pricings: [{ price: 0.02 }],
            invoiceName: 'storage-standard-region',
          },
          {
            planCode: 'storage-standard-region',
            pricings: [{ price: 0.01 }],
            invoiceName: 'storage-standard-region',
          },
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
      setOffsiteReplicationRegion: vi.fn(),
      submitOffsiteReplication: vi.fn(),
      editOffsiteReplication: vi.fn(),
    });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>, {
      wrapper: wrapperOffsiteReplication,
    });
  };

  it('renders the component', () => {
    renderWithRouter(<OffsiteReplication />);
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

    renderWithRouter(<OffsiteReplication />);
    expect(screen.getByTestId('ods-skeleton')).toBeInTheDocument();
  });

  it('allows toggling offsite replication', () => {
    renderWithRouter(<OffsiteReplication />);

    const enableRadio = screen.getByTestId('replication_enabled');
    const disableRadio = screen.getByTestId('replication_disabled');

    expect(disableRadio).toHaveAttribute('data-is-checked', 'true');
    expect(enableRadio).toHaveAttribute('data-is-checked', 'false');
  });

  it('displays the correct price estimation', () => {
    renderWithRouter(<OffsiteReplication />);
    expect(
      screen.getByTestId('replication_price_estimation'),
    ).toBeInTheDocument();
  });
});
