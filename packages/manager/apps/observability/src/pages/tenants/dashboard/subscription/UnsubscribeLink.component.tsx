import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BUTTON_VARIANT, Button, useNotifications } from '@ovh-ux/muk';

import { useDeleteSubscription } from '@/data/hooks/tenants/useDeleteSubscription.hook';
import { UnsubscribeLinkProps } from '@/pages/tenants/dashboard/subscription/UnsubscribeLink.props';
import { getErrorMessage } from '@/utils/error.utils';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export default function UnsubscribeLink({
  tenantId,
  resourceName,
  subscription,
}: UnsubscribeLinkProps) {
  const { t } = useTranslation(['tenants', NAMESPACES.ERROR]);
  const { addError, addSuccess } = useNotifications();

  const { mutate: deleteSubscription, isPending } = useDeleteSubscription({
    onSuccess: () => addSuccess(t('tenants:dashboard.subscription_listing.unsubscribe.success')),
    onError: (error) => {
      const message = getErrorMessage(error);
      addError(t(`${NAMESPACES.ERROR}:error_message`, { message }));
    },
  });

  const handleClick = () => {
    deleteSubscription({
      tenantId,
      resourceName,
      subscriptionId: subscription.id,
    });
  };

  return (
    <Button
      id="delete-subscription"
      onClick={handleClick}
      urn={subscription.urn}
      variant={BUTTON_VARIANT.ghost}
      iamActions={IAM_ACTIONS.DELETE_SUBSCRIPTION}
      isIamTrigger={true}
      displayTooltip={true}
      loading={isPending}
    >
      {t('tenants:dashboard.subscription_listing.unsubscribe.title')}
    </Button>
  );
}
