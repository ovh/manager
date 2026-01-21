import '@/common/setupTests';
import { Mock, vi } from 'vitest';
import { render, wrapper } from '@/common/utils/test.provider';
import BannerInfo from './BannerInfo';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  serviceInfoAuto,
  serviceInfoInCreation,
} from '@/domain/__mocks__/serviceInfo';
import BannerServiceInCreation from './BannerServiceInCreation';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { domainResourceInTransfer } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

describe('BannerInfo component', () => {
  it('renders the "service is in creation" banner when the service state is "inCreation"', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
    });

    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: domainResourceInTransfer,
      isFetchingDomainZone: false,
    });

    const { getByTestId } = render(
      <BannerServiceInCreation serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-service-in-creation')).toBeInTheDocument();
  });

  it('renders nothing when the service is not in creation', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
    });

    const { queryByTestId } = render(<BannerInfo serviceName="example.com" />, {
      wrapper,
    });

    expect(queryByTestId('banner-service-in-creation')).not.toBeInTheDocument();
  });
});
