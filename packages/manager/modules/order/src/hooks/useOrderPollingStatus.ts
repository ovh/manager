import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  OrderData,
  OrderDetail,
  OrderStatus,
  getOrderData,
  getOrderDetails,
  getOrderDetailsList,
  getOrderList,
  getOrderStatus,
} from '../api';

export type DetailedOrder = OrderData & {
  status: OrderStatus;
  details: OrderDetail[];
};

const toDetailedOrder = async (orderId: number): Promise<DetailedOrder> => {
  const orderData = await getOrderData(orderId);
  const orderProductList = await getOrderDetailsList(orderId);
  const detailsResponse = await Promise.all(
    orderProductList.data.map((detailId) => getOrderDetails({ orderId, detailId })),
  );
  const statusResponse = await getOrderStatus(orderId);
  return {
    ...orderData.data,
    status: statusResponse.data,
    details: detailsResponse.map((detail) => detail.data),
  };
};

const getOrderIdListWithDescription = (
  detailedOrderList: DetailedOrder[] = [],
  orderDetailDescription = '',
) =>
  detailedOrderList.filter(({ details }) =>
    details.some(({ description }) => description.includes(orderDetailDescription)),
  );

export enum OrderDescription {
  vrack = 'vRack',
  vrackServices = 'vRack Services',
}

export const getDeliveringOrderQueryKey = (description: OrderDescription | string) => [
  'deliveringOrders',
  description,
];

const getDeliveringOrderList = async (orderDetailDescription: string) => {
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
    .filter(({ status }) => ['delivering', 'checking'].includes(status))
    .map(({ orderId }) => orderId);

  const detailedOrderList = await Promise.all(deliveringOrderList.map(toDetailedOrder));

  return getOrderIdListWithDescription(detailedOrderList, orderDetailDescription);
};

/**
 * Check for orders that contain a certain type of product and refresh the order untill it's delivered
 */
export const useOrderPollingStatus = ({
  pollingKey,
  queryToInvalidateOnDelivered,
  refetchInterval = 120000,
}: {
  pollingKey: OrderDescription | string;
  queryToInvalidateOnDelivered: string[];
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: getDeliveringOrderQueryKey(pollingKey),
    queryFn: async () => {
      const orderList = await getDeliveringOrderList(pollingKey);
      if (orderList.length === 0) {
        void queryClient.invalidateQueries({
          queryKey: queryToInvalidateOnDelivered,
        });
      }
      return orderList;
    },
    refetchInterval,
  });

  return query;
};
