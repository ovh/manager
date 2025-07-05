import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

export const DeactivatedOfferGold = (): JSX.Element => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex justify-between items-center">
      <OdsBadge
        label={t('deactivated_label')}
        data-testid="gold-offer-status"
      />

      <ActionMenu
        id="ellipsis-action-activate"
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
        items={[
          {
            id: 1,
            label: t('activate_action'),
            onClick: () => {},
          },
        ]}
      />
    </div>
  );
};
