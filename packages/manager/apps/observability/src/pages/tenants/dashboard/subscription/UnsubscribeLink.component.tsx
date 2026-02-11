import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BUTTON_VARIANT, Button } from '@ovh-ux/muk';

import { UnsubscribeLinkProps } from '@/pages/tenants/dashboard/subscription/UnsubscribeLink.props';
import { getDeleteTenantSubscriptionUrl } from '@/routes/Routes.utils';

export default function UnsubscribeLink({
  tenantId,
  resourceName,
  subscription,
}: UnsubscribeLinkProps) {
  const { t } = useTranslation(['tenants', NAMESPACES.ERROR]);
  const navigate = useNavigate();

  const handleClick = () =>
    navigate(
      getDeleteTenantSubscriptionUrl({ tenantId, resourceName, subscriptionId: subscription.id }),
    );

  return (
    // TODO: Add IAM actions and trigger
    <Button id="delete-subscription" onClick={handleClick} variant={BUTTON_VARIANT.ghost}>
      {t('tenants:dashboard.subscription_listing.unsubscribe.cta')}
    </Button>
  );
}
