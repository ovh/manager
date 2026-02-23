import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { Order } from '@ovh-ux/manager-module-order';

export type Operation = {
  id: number;
  product: {
    description: string;
    name: string;
  };
  status: 'CANCELLED' | 'DELAYED' | 'DOING' | 'DONE' | 'ERROR' | 'SCHEDULED' | 'TODO';
  type: 'UPGRADE';
};

export type UpgradeBandwidthResponse = { order: Order; operation: Operation };

/**
 * Only if customer already has a non-default bandwidth option in place
 * And wants to change to another non-default bandwidth option (upgrade or downgrade)
 */
export const postUpgradeBandwidth = ({
  serviceName,
  planCode,
}: {
  serviceName: string;
  planCode: string;
}): Promise<ApiResponse<UpgradeBandwidthResponse>> =>
  v6.post<UpgradeBandwidthResponse>(`/order/upgrade/bandwidthVrack/${serviceName}/${planCode}`, {
    autoPayWithPreferredPaymentMethod: false,
    quantity: 1,
  });
