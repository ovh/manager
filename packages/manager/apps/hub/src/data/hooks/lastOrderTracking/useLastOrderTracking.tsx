import { useLastOrder } from '../lastOrder/useLastOrder';
import { useOrderCompleteHistory } from '../orderCompleteHistory/useOrderCompleteHistory';
import { useOrderDetails } from '../orderDetails/useOrderDetails';
import { useOrderStatus } from '../orderStatus/useOrderStatus';

export const useLastOrderTracking = () => {
  const {
    data: lastOrder,
    isLoading: isLastOrderLoading,
    error: lastOrderError,
    refetch: refetchLastOrder,
  } = useLastOrder();
  const orderId = lastOrder?.data?.orderId;
  const orderDate = lastOrder?.data?.date;

  // Use dependent queries to wait for the lastOrder to load
  const {
    data: status,
    isLoading: isOrderStatusLoading,
    error: orderStatusError,
    refetch: refetchOrderStatus,
  } = useOrderStatus(orderId);
  const {
    data: details,
    isLoading: isOrderDetailsLoading,
    error: orderDetailsError,
    refetch: refetchOrderDetails,
  } = useOrderDetails(orderId);
  const {
    data: history,
    isLoading: isHistoriesLoading,
    error: historiesError,
    refetch: refetchHistory,
  } = useOrderCompleteHistory(orderId, status, orderDate);

  return {
    data: {
      ...details,
      status,
      history,
      ...lastOrder?.data,
    },
    isLoading:
      isLastOrderLoading || isOrderStatusLoading || isOrderDetailsLoading || isHistoriesLoading,
    error: lastOrderError || orderStatusError || orderDetailsError || historiesError,
    refetch: async () => {
      await refetchLastOrder();
      if (orderId) await refetchOrderStatus();
      if (orderId) await refetchOrderDetails();
      if (orderId && status && orderDate) await refetchHistory();
    },
  };
};
