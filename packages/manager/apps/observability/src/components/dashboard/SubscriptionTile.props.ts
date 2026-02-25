import { LocationPathParams } from '@/routes/Routes.constants';

export interface SubscriptionTileProps extends LocationPathParams {
  subscriptions: number;
  isLoading: boolean;
}
