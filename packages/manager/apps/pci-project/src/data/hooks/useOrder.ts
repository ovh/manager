import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  ORDER_FOLLOW_UP_POLLING_INTERVAL,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
  PCI_HDS_ADDON,
  PCI_HDS_DISCOVERY_ADDON,
} from '@/constants';
import {
  getOrderDetails,
  getOrderDetailWithExtension,
  getOrderFollowUp,
} from '@/data/api/order';
import { TOrderFollowUp } from '@/data/types/order.type';

const useOrderDetailWithExtensions = ({
  orderId,
  orderDetailIds,
}: {
  orderId: number;
  orderDetailIds: number[];
}) => {
  return useQueries({
    queries: orderDetailIds.map((orderDetailId: number) => ({
      queryKey: [
        `/me/order/${orderId}/details/${orderDetailId}/with-extension`,
      ],
      queryFn: () => getOrderDetailWithExtension(orderId, orderDetailId),
      enabled: orderDetailIds.length > 0,
    })),
    combine: (results) => ({
      data: results.map((result) => result.data),
      isLoading: results.some((result) => result.isLoading),
    }),
  });
};

const useOrderDetailIds = ({
  orderId,
  enabled = true,
}: {
  orderId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [`/me/order/${orderId}/details`],
    queryFn: () => getOrderDetails(orderId),
    enabled: enabled && !!orderId,
  });
};

export const useDeliveredProjectId = ({
  orderId,
  enabled = true,
  onProjectIdDelivered,
}: {
  orderId: number;
  enabled?: boolean;
  onProjectIdDelivered: (projectId: string) => void;
}) => {
  // Step 1: Get order detail IDs
  const { data: orderDetailIds = [] } = useOrderDetailIds({
    orderId,
    enabled,
  });

  const {
    data: orderDetailsWithExtensions = [],
    isLoading,
  } = useOrderDetailWithExtensions({
    orderId,
    orderDetailIds,
  });

  const projectId = useMemo(() => {
    if (!isLoading && orderDetailsWithExtensions.length > 0) {
      const orderDetailWithExtension = orderDetailsWithExtensions.find(
        (item) =>
          item?.extension?.order.plan.code === PCI_HDS_ADDON.parentPlanCode ||
          item?.extension?.order.plan.code ===
            PCI_HDS_DISCOVERY_ADDON.parentPlanCode,
      );

      if (orderDetailWithExtension) {
        onProjectIdDelivered(orderDetailWithExtension.domain);
        return orderDetailWithExtension.domain;
      }
    }
    return undefined;
  }, [isLoading, orderDetailsWithExtensions, onProjectIdDelivered]);

  return {
    data: projectId,
  };
};

const getOrderFollowUpQueryKey = (orderId: number) => [
  `/me/order/${orderId}/followUp/polling`,
];

/**
 * Determines whether project creation polling should continue based on order follow-up data.
 * Returns the polling interval or false to stop polling.
 *
 * @param followUpData - Array of order follow-up items
 * @param onProjectDelivered - Callback when project delivery is complete
 * @param onProjectDeliveryFail - Callback when project delivery fails
 * @returns Polling interval in milliseconds or false to stop polling
 */
export const shouldRefetchProjectCreation = (
  onProjectDelivered: () => void,
  onProjectDeliveryFail: () => void,
  followUpData?: TOrderFollowUp[],
): number | false => {
  // Continue polling if no follow up data
  if (!followUpData) {
    return ORDER_FOLLOW_UP_POLLING_INTERVAL;
  }

  const deliveringStep = followUpData.find(
    (followUpItem: TOrderFollowUp) =>
      followUpItem.step === ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING,
  );

  // Stop polling if delivery is complete
  if (deliveringStep?.status === ORDER_FOLLOW_UP_STATUS_ENUM.DONE) {
    onProjectDelivered();
    return false;
  }

  // Stop polling if any step has an error
  const hasStepInError = followUpData.some(
    (followUpItem: TOrderFollowUp) =>
      followUpItem.status === ORDER_FOLLOW_UP_STATUS_ENUM.ERROR,
  );

  if (hasStepInError) {
    onProjectDeliveryFail();
    return false;
  }

  // Continue polling
  return ORDER_FOLLOW_UP_POLLING_INTERVAL;
};

export const useOrderFollowUpPolling = ({
  orderId,
  onProjectDelivered,
  onProjectDeliveryFail,
}: {
  orderId: number;
  onProjectDelivered: () => void;
  onProjectDeliveryFail: () => void;
}) => {
  return useQuery({
    queryKey: getOrderFollowUpQueryKey(orderId),
    queryFn: () => getOrderFollowUp(orderId),
    enabled: !!orderId,
    refetchInterval: ({ state }) =>
      shouldRefetchProjectCreation(
        onProjectDelivered,
        onProjectDeliveryFail,
        state.data,
      ),
    refetchIntervalInBackground: true,
  });
};
