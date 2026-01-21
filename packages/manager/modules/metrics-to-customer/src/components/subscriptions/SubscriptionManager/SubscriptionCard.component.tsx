import { useTranslation } from 'react-i18next';

import {
    Card,
    CARD_COLOR,
    Text,
    TEXT_PRESET,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { SubscriptionCardProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionCard.props';
import SubscriptionToggle from '@/components/cta/SubscriptionToggle.component';


const SubscriptionCard = <TSubscription = unknown>({
    title,
    subTitle,
    subscriptionUrls,
    itemId,
    subscription,
    resourceName,
    onCreate,
    onDelete,
    isCreating,
    isDeleting,
}: SubscriptionCardProps<TSubscription>) => {
    const { t } = useTranslation(NAMESPACES.SUBSCRIPTIONS);

    const isHighlighted = !!subscription;

    return (<Card
        color={isHighlighted ? CARD_COLOR.primary : CARD_COLOR.neutral}
        className={
            `Card ${isHighlighted ? "bg-[var(--ods-color-primary-050)] border-2" : "border-1"} 
            p-6 hover:bg-slate-50 transition cursor-pointer flex flex-row items-center justify-between`
        }>
        <div className="flex flex-col">
            <Text className="text-[var(--ods-color-primary-500)] hover:underline" preset={TEXT_PRESET.label}>
                {title}
            </Text>
            <Text preset={TEXT_PRESET.small}>
                {subTitle}
            </Text>
        </div>

        <SubscriptionToggle<TSubscription>
            itemId={itemId}
            resourceName={resourceName}
            subscription={subscription}
            subscriptionUrls={subscriptionUrls}
            onCreate={onCreate}
            onDelete={onDelete}
            isCreating={isCreating}
            isDeleting={isDeleting}
        />
    </Card>
    );
};
export default SubscriptionCard;

