import { Region } from "@/types/region.type";
import { SubscriptionUrls } from "@/types/SubscriptionUrls.type";

export interface TenantsSubscriptionsDrawerProps {
    serviceName: string;
    regions: Region[];
    defaultRetention: string;
    subscriptionUrls: SubscriptionUrls;
}
