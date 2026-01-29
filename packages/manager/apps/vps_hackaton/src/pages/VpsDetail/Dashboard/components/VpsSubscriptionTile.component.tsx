import { useTranslation } from 'react-i18next';
import { Text, Card } from '@ovhcloud/ods-react';
import type { TVpsSubscriptionForView } from '../view-models/dashboard.view-model';

type TVpsSubscriptionTileProps = {
  subscription: TVpsSubscriptionForView;
};

export const VpsSubscriptionTile = ({
  subscription,
}: TVpsSubscriptionTileProps) => {
  const { t } = useTranslation('vps');

  return (
    <Card className="p-6">
      <Text preset="heading-4" className="mb-4">
        {t('vps_dashboard_subscription_tile_title')}
      </Text>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Text preset="paragraph" className="text-gray-600">
            {t('vps_dashboard_subscription_creation')}
          </Text>
          <Text preset="paragraph" className="font-medium">
            {subscription.creationDate}
          </Text>
        </div>

        <div className="flex justify-between">
          <Text preset="paragraph" className="text-gray-600">
            {t('vps_dashboard_subscription_expiration')}
          </Text>
          <Text preset="paragraph" className="font-medium">
            {subscription.expirationDate ?? '-'}
          </Text>
        </div>

        <div className="flex justify-between">
          <Text preset="paragraph" className="text-gray-600">
            {t('vps_dashboard_subscription_auto_renew')}
          </Text>
          <Text preset="paragraph" className="font-medium">
            {subscription.autoRenew
              ? t('vps_dashboard_subscription_yes')
              : t('vps_dashboard_subscription_no')}
          </Text>
        </div>
      </div>
    </Card>
  );
};
