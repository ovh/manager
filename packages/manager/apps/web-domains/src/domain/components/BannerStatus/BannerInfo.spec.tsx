import '@/common/setupTests';
import { Mock, vi } from 'vitest';
import { render } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import BannerInfo from './BannerInfo';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  serviceInfoAuto,
  serviceInfoManuel,
} from '@/domain/__mocks__/serviceInfo';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

describe('BannerInfo component', () => {
  it('renders info banner with link when MANUAL renew mode', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoManuel,
    });

    const { getByTestId } = render(<BannerInfo serviceName="example.com" />, {
      wrapper,
    });

    expect(getByTestId('banner-info')).toBeInTheDocument();
  });

  it('renders nothing when renew mode is not MANUAL', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
    });

    const { queryByTestId } = render(<BannerInfo serviceName="example.com" />, {
      wrapper,
    });

    expect(queryByTestId('banner-info')).not.toBeInTheDocument();
  });
});
