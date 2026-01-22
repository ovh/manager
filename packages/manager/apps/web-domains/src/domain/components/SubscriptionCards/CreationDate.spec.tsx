import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';
import CreationDate from './CreationDate';
import { TDomainResource } from '@/domain/types/domainResource';

describe('CreationDate component', () => {
  it('renders loading state when data is fetching', () => {
    render(<CreationDate domainResource={domainResourceOK} />, { wrapper });

    expect(
      screen.getByText(
        '@ovh-ux/manager-common-translations/dashboard:creation_date',
      ),
    ).toBeInTheDocument();
  });

  it('renders populated state with creation date information', async () => {
    render(<CreationDate domainResource={domainResourceOK} />, { wrapper });

    expect(screen.getByText('2023-01-15T10:30:00Z')).toBeInTheDocument();
  });

  it('should display the creation date from domainResources', () => {
    const customDomainResources: TDomainResource = {
      currentState: {
        createdAt: '2024-06-20T14:45:00Z',
      },
    } as TDomainResource;

    render(<CreationDate domainResource={customDomainResources} />, {
      wrapper,
    });

    expect(screen.getByText('2024-06-20T14:45:00Z')).toBeInTheDocument();
  });
});
