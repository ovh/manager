import '@/common/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import BannerInfo from './BannerInfo';
import { useGetServiceInformation } from '@/domain/hooks/data/query';
import {
  serviceInfoAuto,
  serviceInfoManuel,
} from '@/domain/__mocks__/serviceInfo';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

describe('BannerInfo component', () => {
  it('renders info banner with link when MANUAL renew mode', () => {
    (useGetServiceInformation as jest.Mock).mockReturnValue({
      serviceInfo: serviceInfoManuel,
    });

    const { getByTestId } = render(<BannerInfo serviceName="example.com" />, {
      wrapper,
    });

    expect(getByTestId('banner-info')).toBeInTheDocument();
  });

  it('renders nothing when renew mode is not MANUAL', () => {
    (useGetServiceInformation as jest.Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
    });

    const { queryByTestId } = render(<BannerInfo serviceName="example.com" />, {
      wrapper,
    });

    expect(queryByTestId('banner-info')).not.toBeInTheDocument();
  });
});
