import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BADGE_COLOR } from '@ovhcloud/ods-react';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpDetails, IpMitigationStateEnum, IpMitigationType } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';
import { getBadgeByLabel } from '@/test-utils';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { IpAntiDdos } from './IpAntiDdos';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipDetails: undefined as IpDetails | undefined,
    loading: true,
  })),
);
const useGetIpMitigationWithoutIcebergMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipMitigation: undefined as IpMitigationType | undefined,
    loading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpMitigationWithoutIceberg: useGetIpMitigationWithoutIcebergMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider value={listingContextDefaultParams}>
        <IpAntiDdos {...params} />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpAntiDdos Component', () => {
  it('Should display automatic if no mitigation set', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      loading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {} as IpMitigationType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosAutomatic',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.neutral);
      expect(
        getByText(`listingColumnsIpAntiDDosAutomaticTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display permanent if 1 mitigation is configured as Permanent', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      loading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        permanent: true,
        state: IpMitigationStateEnum.OK,
      } as IpMitigationType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosPermanent',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.warning);
      expect(
        getByText(`listingColumnsIpAntiDDosPermanentTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display in action if 1 mitigation is configured as auto', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      loading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        auto: true,
        state: IpMitigationStateEnum.OK,
      } as IpMitigationType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosInAction',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.success);
      expect(
        getByText(`listingColumnsIpAntiDDosInActionTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display Pending if mitigation exist and state is not ok', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      loading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        state: IpMitigationStateEnum.CREATION_PENDING,
      } as IpMitigationType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosPending',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.warning);
      expect(getByText(`listingColumnsIpAntiDDosPendingTooltip`)).toBeDefined();
    });
  });
});
