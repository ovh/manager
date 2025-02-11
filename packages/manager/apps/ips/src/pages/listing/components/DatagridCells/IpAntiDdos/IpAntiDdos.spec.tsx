import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpAntiDdos, IpAntiDdosProps } from './IpAntiDdos';
import { IpMitigationStateEnum, IpMitigationType } from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);
const useGetIpMitigationMock = vi.hoisted(() =>
  vi.fn(() => ({ ipMitigation: undefined, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpMitigation: useGetIpMitigationMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpAntiDdosProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpAntiDdos {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpAntiDdos Component', async () => {
  it('Should display automatic if no mitigation set', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpMitigationMock.mockReturnValue({
      ipMitigation: [] as IpMitigationType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`listingColumnsIpAntiDDosAutomatic`)).toBeDefined();
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
    useGetIpMitigationMock.mockReturnValue({
      ipMitigation: [
        { permanent: true, state: IpMitigationStateEnum.OK },
      ] as IpMitigationType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`listingColumnsIpAntiDDosPermanent`)).toBeDefined();
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
    useGetIpMitigationMock.mockReturnValue({
      ipMitigation: [
        { auto: true, state: IpMitigationStateEnum.OK },
      ] as IpMitigationType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`listingColumnsIpAntiDDosInAction`)).toBeDefined();
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
    useGetIpMitigationMock.mockReturnValue({
      ipMitigation: [
        { state: IpMitigationStateEnum.CREATION_PENDING },
      ] as IpMitigationType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`listingColumnsIpAntiDDosPending`)).toBeDefined();
      expect(getByText(`listingColumnsIpAntiDDosPendingTooltip`)).toBeDefined();
    });
  });
});
