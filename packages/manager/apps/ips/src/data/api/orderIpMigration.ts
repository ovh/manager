import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IpMigrationOrder } from '@/types/ipMigrationOrder';

export const getOrderDedicatedServerList = async (): Promise<ApiResponse<
  string[]
>> => apiClient.v6.get<string[]>('/order/dedicated/server');

export const getOrderDedicatedServerInfo = async (
  serviceName: string,
): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get<string[]>(`/order/dedicated/server/${serviceName}`);

export type OrderDedicatedServerIpMigrationParams = {
  serviceName: string;
  ip: string;
  token: string;
  duration: string;
};

export const getOrderDedicatedServerIpMigrationAvailableDurations = async ({
  serviceName,
  ip,
  token,
}: Omit<
  OrderDedicatedServerIpMigrationParams,
  'duration'
>): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get<string[]>(
    `/order/dedicated/server/${serviceName}/ipMigration?ip=${encodeURIComponent(
      ip,
    )}&token=${token}`,
  );

export const getOrderDedicatedServerIpMigrationDetails = async ({
  serviceName,
  ip,
  token,
  duration,
}: OrderDedicatedServerIpMigrationParams): Promise<ApiResponse<
  Omit<IpMigrationOrder, 'url' | 'orderId'>
>> =>
  apiClient.v6.get<Omit<IpMigrationOrder, 'url' | 'orderId'>>(
    `/order/dedicated/server/${serviceName}/ipMigration/${duration}?ip=${encodeURIComponent(
      ip,
    )}&token=${token}`,
  );

export const postOrderDedicatedServerIpMigration = async ({
  serviceName,
  ip,
  token,
  duration,
}: OrderDedicatedServerIpMigrationParams): Promise<ApiResponse<
  IpMigrationOrder
>> =>
  apiClient.v6.post<IpMigrationOrder>(
    `/order/dedicated/server/${serviceName}/ipMigration/${duration}`,
    { ip, token },
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
