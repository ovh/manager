import { SubscriptionUrls } from "@/types/SubscriptionUrls.type";

export interface TenantsSubscriptionsDrawerProps {    
    regions: string[];
    defaultRetention: string;
    subscriptionUrls: SubscriptionUrls;
}
