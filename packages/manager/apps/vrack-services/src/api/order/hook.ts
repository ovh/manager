import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOrderStatus,
  getOrderDetails,
  getOrderDetailsList,
  getOrderList,
} from './services';

export const toDetailedOrder = async (orderId: number) => {
  const orderProductList = await getOrderDetailsList(orderId);
  const detailsResponse = await Promise.all(
    orderProductList.data.map((detailId) =>
      getOrderDetails({ orderId, detailId }),
    ),
  );
  return {
    orderId,
    details: detailsResponse.map((detail) => detail.data),
  };
};

export const getDeliveringOrderList = (
  orderDetailDescription: string,
) => async () => {
  const todayMinus24Hours = new Date();
  todayMinus24Hours.setTime(Date.now() - 24 * 3600 * 1000);
  const orderList = await getOrderList({ dateFrom: todayMinus24Hours });

  const orderIdsWithStatus = await Promise.all(
    orderList.data.map(async (orderId) => {
      const status = await getOrderStatus(orderId);
      return { orderId, status: status.data };
    }),
  );
  const deliveringOrderList = orderIdsWithStatus
    .filter(({ status }) => status === 'delivering')
    .map(({ orderId }) => orderId);

  const detailedOrderList = await Promise.all(
    deliveringOrderList.map(toDetailedOrder),
  );
  return (
    detailedOrderList
      .filter(({ details }) =>
        details.some(({ description }) =>
          description.includes(orderDetailDescription),
        ),
      )
      .map(({ orderId }) => orderId) || []
  );
};

export const getPollingOderStatusQueryKey = (pollingKey: string) => [
  `/pollOrderStatus-${pollingKey}`,
];

/**
 * Check for orders that contain a certain type of product and refresh the order untill it's delivered
 */
export const useOrderPollingStatus = ({
  pollingKey,
  orderList = [],
  queryToInvalidateOnDelivered,
  pollingInterval = 120000,
}: {
  pollingKey: string;
  orderList: number[];
  queryToInvalidateOnDelivered: string[];
  pollingInterval?: number;
}) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: getPollingOderStatusQueryKey(pollingKey),
    queryFn: async () => {
      const statusList = await Promise.all(orderList.map(getOrderStatus));
      if (
        statusList.every(
          (statusResponse) => statusResponse.data === 'delivered',
        )
      ) {
        queryClient.invalidateQueries({
          queryKey: queryToInvalidateOnDelivered,
        });
      }
      return statusList;
    },
    refetchInterval: (data, query) => {
      console.log({ data, query });
      if (!data || data.length === 0) {
        return 0;
      }
      return data.every((statusResponse) => statusResponse.data === 'delivered')
        ? pollingInterval
        : 0;
    },
  });
};
