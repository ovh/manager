import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { NAMESPACES as MODULE_NAMESPACES } from '@/MetricsToCustomer.translations';
import { BUTTON_SIZE, BUTTON_VARIANT, Button } from '@ovh-ux/muk';

import { SubscriptionToggleProps } from '@/components/cta/SubscriptionToggle.props';

export function SubscriptionToggle<TSubscription = unknown>({
  itemId,
  resourceName,
  subscriptionUrls,
  subscription,
  onCreate,
  onDelete,
  isCreating = false,
  isDeleting = false,
}: SubscriptionToggleProps<TSubscription>) {
  const { t } = useTranslation([MODULE_NAMESPACES.SUBSCRIPTIONS, NAMESPACES.ERROR]);

  const { subscribeUrl } = subscriptionUrls;

  const hasSubscription = subscription !== undefined;

  const handleClick = () => {
    if (hasSubscription && subscription) {
      onDelete({
        subscription,
        itemId,
        resourceName,
      });
    } else {
      onCreate({
        subscribeUrl,
        itemId,
        resourceName,
      });
    }
  };

  const isLoading = hasSubscription ? isDeleting : isCreating;

  return (
    // TODO: Add IAM actions and trigger
    <Button
      variant={BUTTON_VARIANT.ghost}
      size={BUTTON_SIZE.xs}
      id={`${hasSubscription ? "delete" : "create"}-subscription-cta`}
      onClick={handleClick}
      loading={isLoading}
      disabled={isLoading}
    >
      {t(`${MODULE_NAMESPACES.SUBSCRIPTIONS}:subscription.${hasSubscription ? "unsubscribe" : "subscribe"}-cta`)}
    </Button>
  );
}

export default SubscriptionToggle;
