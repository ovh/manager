import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';

export const ActivateOfferGold = ({ id }: { id: string }): JSX.Element => {
  const { t: tStatus } = useTranslation(NAMESPACES.STATUS);
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);

  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      {/* TODO should be diabled or en cours d'acitvation (depending of the status of the offer)
       Which api to use /beckup or /backup/taskId */}
      <OdsBadge label={tStatus('disabled')} />

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
            onClick: () =>
              navigate(urls.activateVeeamBackupOffer.replace(':id', id)),
          },
        ]}
      />
    </div>
  );
};
