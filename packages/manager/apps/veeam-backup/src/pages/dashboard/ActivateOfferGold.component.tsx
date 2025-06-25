import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { OFFER_CREATING_STATUS } from '@/constants';

export const ActivateOfferGold = ({
  id,
  status,
}: {
  id: string;
  status?: VeeamBackupOffer['status'];
}): JSX.Element => {
  const { t: tStatus } = useTranslation(NAMESPACES.STATUS);
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <OdsBadge
        label={
          status === OFFER_CREATING_STATUS
            ? tStatus('activation_in_progress')
            : tStatus('disabled')
        }
      />

      <ActionMenu
        id={`action-gold-offer-${id}`}
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
        items={[
          {
            'data-testid': TEST_IDS.activateGoldOfferAction,
            id: 1,
            label: tAction('activate'),
            isDisabled: status === OFFER_CREATING_STATUS,
            onClick: () => {
              navigate(urls.activateVeeamBackupOffer.replace(':id', id));
            },
          },
        ]}
      />
    </div>
  );
};
