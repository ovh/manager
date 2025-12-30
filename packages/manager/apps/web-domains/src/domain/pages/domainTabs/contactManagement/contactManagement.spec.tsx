import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { vi, describe, it, beforeEach, Mock, expect } from 'vitest';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import ContactManagement from './contactManagement';

const contactA11yRules = {
  'heading-order': { enabled: false },
};

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

  it('should render contact management title and subtitle', async () => {
    const { container } = render(<ContactManagement />);

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

    await expect(container).toBeAccessible({ rules: contactA11yRules });
  });

  it('should render HolderCard with correct props', async () => {
    const { container } = render(<ContactManagement />);

    expect(screen.getByTestId('holder-card')).toBeInTheDocument();
    await expect(container).toBeAccessible({ rules: contactA11yRules });
  });

  it('should render NichandleCard for each contact type', async () => {
    const { container } = render(<ContactManagement />);

    expect(screen.getAllByTestId('nichandle-card')).toHaveLength(3);
    await expect(container).toBeAccessible({ rules: contactA11yRules });
  });

  it('should render grid layout with correct spacing', async () => {
    const { container } = render(<ContactManagement />);

    const grid = screen.getByTestId('contact-management-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-3');
    expect(grid).toHaveClass('grid-rows-2');
    expect(grid).toHaveClass('gap-6');

    await expect(container).toBeAccessible({ rules: contactA11yRules });
  });
});
