import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';
import CreationDate from './CreationDate';

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

    expect(screen.getByText('1 janv. 2023')).toBeInTheDocument();
  });
});
