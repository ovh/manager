import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ListingContext } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpAntiDdos, IpAntiDdosProps } from './IpAntiDdos';
import { IpMitigationStateEnum, IpMitigationType } from '@/data/api';
import { getOdsBadgeByLabel } from '@/test-utils';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);
const useGetIpMitigationWithoutIcebergMock = vi.hoisted(() =>
  vi.fn(() => ({ ipMitigation: undefined, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpMitigationWithoutIceberg: useGetIpMitigationWithoutIcebergMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpAntiDdosProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider value={listingContextDefaultParams}>
        <IpAntiDdos {...params} />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpAntiDdos Component', async () => {
  it('Should display automatic if no mitigation set', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {} as IpMitigationType,
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosAutomatic',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.neutral);
      expect(
        getByText(`listingColumnsIpAntiDDosAutomaticTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display permanent if 1 mitigation is configured as Permanent', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        permanent: true,
        state: IpMitigationStateEnum.OK,
      } as IpMitigationType,
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosPermanent',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.warning);
      expect(
        getByText(`listingColumnsIpAntiDDosPermanentTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display in action if 1 mitigation is configured as auto', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        auto: true,
        state: IpMitigationStateEnum.OK,
      } as IpMitigationType,
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosInAction',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.success);
      expect(
        getByText(`listingColumnsIpAntiDDosInActionTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display Pending if mitigation exist and state is not ok', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        state: IpMitigationStateEnum.CREATION_PENDING,
      } as IpMitigationType,
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAntiDDosPending',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.warning);
      expect(getByText(`listingColumnsIpAntiDDosPendingTooltip`)).toBeDefined();
    });
  });
});
