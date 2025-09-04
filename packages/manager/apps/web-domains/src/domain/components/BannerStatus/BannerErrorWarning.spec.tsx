import '@/common/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import {
  serviceInfoDetailSuspendedTechnical,
  serviceInfoNotSuspendedTechnical,
  serviceInfoRestorable,
} from '@/domain/__mocks__/serviceInfoDetail';
import BannerErrorWarning from './BannerErrorWarning';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

describe('BannerCritical component', () => {
  it('renders error banner when TECHNICAL_SUSPEND and SUSPENDED', () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: serviceInfoDetailSuspendedTechnical,
    });

    const { getByTestId } = render(
      <BannerErrorWarning serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-error')).toBeInTheDocument();
  });

  it('renders error banner when ABUSE', () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: serviceInfoNotSuspendedTechnical,
    });

    const { getByTestId } = render(
      <BannerErrorWarning serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-warning')).toBeInTheDocument();
  });

  it('renders error banner when RESTORABLE', () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: serviceInfoRestorable,
    });

    const { getByTestId } = render(
      <BannerErrorWarning serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-warning')).toBeInTheDocument();
    expect(getByTestId('banner-body').textContent).toBe(
      'domain_tab_general_information_banner_restorable',
    );
  });
});
