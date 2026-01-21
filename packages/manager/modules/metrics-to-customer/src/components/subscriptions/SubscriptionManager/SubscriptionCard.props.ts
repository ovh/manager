import { SubscriptionUrls } from "@/types/SubscriptionUrls.type";
import { SubscriptionToggleProps } from "@/components/cta/SubscriptionToggle.props";

export type SubscriptionCardProps<TSubscription = unknown> = {
    title: string;
    subTitle: string;
    resourceName: string;
    subscriptionUrls: SubscriptionUrls;
    itemId: string;
    subscription?: TSubscription;
} & Pick<SubscriptionToggleProps<TSubscription>, 'onCreate' | 'onDelete' | 'isCreating' | 'isDeleting'>;

