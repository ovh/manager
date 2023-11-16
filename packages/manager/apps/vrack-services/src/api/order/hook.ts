import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOrderStatus,
  getOrderDetails,
  getOrderDetailsList,
  getOrderList,
  getOrderData,
} from './services';
import { OrderDetail, OrderStatus, OrderData } from './order.type';

export type DetailedOrder = OrderData & {
  status: OrderStatus;
  details: OrderDetail[];
};

const toDetailedOrder = async (orderId: number): Promise<DetailedOrder> => {
  const orderData = await getOrderData(orderId);
  const orderProductList = await getOrderDetailsList(orderId);
  const detailsResponse = await Promise.all(
    orderProductList.data.map((detailId) =>
      getOrderDetails({ orderId, detailId }),
    ),
  );
  const statusResponse = await getOrderStatus(orderId);
  return {
    orderId,
    ...orderData.data,
    status: statusResponse.data,
    details: detailsResponse.map((detail) => detail.data),
  };
};

const getOrderIdListWithDescription = (
  detailedOrderList: DetailedOrder[] = [],
  orderDetailDescription: string,
) =>
  detailedOrderList.filter(({ details }) =>
    details.some(({ description }) =>
      description.includes(orderDetailDescription),
    ),
  );

export enum OrderDescription {
  vrack = 'vRack',
  vrackServices = 'vRack Services',
}

export const getDeliveringOrderQueryKey = (description: OrderDescription) => [
  `deliveringOrders-${description}`,
];

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

  return getOrderIdListWithDescription(
    detailedOrderList,
    orderDetailDescription,
  );
};

export const getPollingOderStatusQueryKey = (pollingKey: OrderDescription) => [
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
  pollingKey: OrderDescription;
  orderList: DetailedOrder[];
  queryToInvalidateOnDelivered: string[];
  pollingInterval?: number;
}) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: getPollingOderStatusQueryKey(pollingKey),
    queryFn: async () => {
      if (orderList.every(({ status }) => status === 'delivered')) {
        queryClient.invalidateQueries({
          queryKey: queryToInvalidateOnDelivered,
        });
      }
      return orderList.map(({ status }) => status);
    },
    refetchInterval: (data) => {
      if (!data || data.length === 0) {
        return 0;
      }
      return data.every((status) => status === 'delivered')
        ? pollingInterval
        : 0;
    },
  });
};
