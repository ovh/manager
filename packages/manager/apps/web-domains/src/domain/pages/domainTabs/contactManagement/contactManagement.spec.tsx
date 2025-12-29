import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { vi, describe, it, beforeEach, Mock } from 'vitest';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import ContactManagement from './contactManagement';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('@/domain/components/ContactCards/HolderCard', () => ({
  default: () => <div data-testid="holder-card">Holder card component</div>,
}));

vi.mock('@/domain/components/ContactCards/NichandleCard', () => ({
  default: () => (
    <div data-testid="nichandle-card">Nichandle card component</div>
  ),
}));

describe('ContactManagement Component', () => {
  const mockServiceInfo = {
    customer: {
      contacts: [
        { type: 'Administrator', nichandle: 'ADMIN123' },
        { type: 'Technical', nichandle: 'TECH456' },
        { type: 'Billing', nichandle: 'BILL789' },
      ],
    },
  };
  const mockNichandleInfo = { nichandle: 'ADMIN123' };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: mockNichandleInfo,
    });
  });

  it('should render spinner when loading', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    });

    render(<ContactManagement />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render contact management title and subtitle', () => {
    render(<ContactManagement />);

    expect(
      screen.getByText('domain_tab_contact_management_tile_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_contact_management_tile_subtitle'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'domain_tab_contact_management_configuration_information',
      ),
    ).toBeInTheDocument();
  });

  it('should render HolderCard with correct props', () => {
    render(<ContactManagement />);

    expect(screen.getByTestId('holder-card')).toBeInTheDocument();
  });

  it('should render NichandleCard for each contact type', () => {
    render(<ContactManagement />);

    expect(screen.getAllByTestId('nichandle-card')).toHaveLength(3);
  });

  it('should render grid layout with correct spacing', () => {
    render(<ContactManagement />);

    const grid = screen.getByTestId('contact-management-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-3');
    expect(grid).toHaveClass('grid-rows-2');
    expect(grid).toHaveClass('gap-6');
  });
});
