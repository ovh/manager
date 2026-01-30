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
import { useGetDomainResource, useGetDomainZone, useGetMeTaskIds } from '@/domain/hooks/data/query';
import { domainResourceInTransfer, domainResourceInCreation } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetDomainZone: vi.fn(),
  useGetMeTaskIds: vi.fn(),
}));

describe('BannerInfo component', () => {
  it('renders the "service is in creation" banner with transfer content when domain is in transfer', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
    });

    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: domainResourceInTransfer,
      isFetchingDomainZone: false,
    });

    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: null,
      isFetchingDomainZone: false,
    });

    (useGetMeTaskIds as Mock).mockReturnValue({
      data: [123],
    });

    const { getByTestId, getByText, queryByText } = render(
      <BannerServiceInCreation serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-service-in-creation')).toBeInTheDocument();

    // Verify base keys are present
    expect(getByText('domain_tab_general_information_banner_service_in_creation_title')).toBeInTheDocument();
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body')).toBeInTheDocument();

    // Verify transfer follow link is present (transfer task with operation id)
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body_follow_transfer')).toBeInTheDocument();

    // Verify zone message is not present (domainZone is null)
    expect(queryByText('domain_tab_general_information_banner_service_in_creation_body_zone')).not.toBeInTheDocument();

    // Verify ongoing operations link is not present (follow transfer link is shown instead)
    expect(queryByText('domain_tab_general_information_banner_link_ongoing_operations')).not.toBeInTheDocument();
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

  it('renders the banner with zone message when domain zone is not null', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
    });

    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: domainResourceInTransfer,
      isFetchingDomainZone: false,
    });

    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: { zone: 'example.com' },
      isFetchingDomainZone: false,
    });

    (useGetMeTaskIds as Mock).mockReturnValue({
      data: [123],
    });

    const { getByTestId, getByText } = render(
      <BannerServiceInCreation serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-service-in-creation')).toBeInTheDocument();

    // Verify zone message is present when domainZone exists
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body_zone')).toBeInTheDocument();

    // Verify base content is present
    expect(getByText('domain_tab_general_information_banner_service_in_creation_title')).toBeInTheDocument();
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body')).toBeInTheDocument();

    // Verify follow transfer link is present
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body_follow_transfer')).toBeInTheDocument();
  });

  it('renders the banner with ongoing operations link when task ids is empty', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
    });

    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: domainResourceInTransfer,
      isFetchingDomainZone: false,
    });

    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: null,
      isFetchingDomainZone: false,
    });

    (useGetMeTaskIds as Mock).mockReturnValue({
      data: [],
    });

    const { getByTestId, getByText, queryByText } = render(
      <BannerServiceInCreation serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-service-in-creation')).toBeInTheDocument();

    // Verify base content is present
    expect(getByText('domain_tab_general_information_banner_service_in_creation_title')).toBeInTheDocument();
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body')).toBeInTheDocument();

    // Verify follow transfer link is NOT present (no operation id)
    expect(queryByText('domain_tab_general_information_banner_service_in_creation_body_follow_transfer')).not.toBeInTheDocument();

    // Verify LinkToOngoingOperations link is rendered instead
    expect(getByText('domain_tab_general_information_banner_link_ongoing_operations')).toBeInTheDocument();
  });

  it('renders the banner with registration content when domain resource is in creation', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
    });

    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: domainResourceInCreation,
      isFetchingDomainZone: false,
    });

    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: null,
      isFetchingDomainZone: false,
    });

    (useGetMeTaskIds as Mock).mockReturnValue({
      data: [],
    });

    const { getByTestId, getByText, queryByText } = render(
      <BannerServiceInCreation serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('banner-service-in-creation')).toBeInTheDocument();

    // Verify base content is present
    expect(getByText('domain_tab_general_information_banner_service_in_creation_title')).toBeInTheDocument();
    expect(getByText('domain_tab_general_information_banner_service_in_creation_body')).toBeInTheDocument();

    // Verify transfer-specific content is NOT present (this is a creation, not a transfer)
    expect(queryByText('domain_tab_general_information_banner_service_in_creation_body_follow_transfer')).not.toBeInTheDocument();

    // Verify LinkToOngoingOperations is rendered (no transfer task)
    expect(getByText('domain_tab_general_information_banner_link_ongoing_operations')).toBeInTheDocument();
  });
});
